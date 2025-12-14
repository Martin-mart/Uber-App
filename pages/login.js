import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) throw new Error('User data not found');

      const role = userDoc.data().role;
      const approved = userDoc.data().approved;

      if (role === 'driver' && !approved) {
        setError('Your driver account is not approved yet.');
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (role === 'admin') router.push('/admin');
      else if (role === 'driver') router.push('/driver-dashboard');
      else router.push('/user-dashboard');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setError('No account found for this Google user.');
        setLoading(false);
        return;
      }

      const role = userDoc.data().role;
      if (role !== 'customer') {
        setError('Google login is only allowed for customers.');
        setLoading(false);
        return;
      }

      router.push('/user-dashboard');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <Wrapper>
      <Card>
        <Title>Login</Title>
        <InputGroup>
          <InputLabel>Email</InputLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        </InputGroup>

        <InputGroup>
          <InputLabel>Password</InputLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        </InputGroup>

        {error && <ErrorText>{error}</ErrorText>}

        <PrimaryButton onClick={handleEmailLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </PrimaryButton>

        <Divider>OR</Divider>

        <GoogleButton onClick={handleGoogleLogin} disabled={loading}>
          Sign in with Google
        </GoogleButton>
      </Card>
    </Wrapper>
  );
};

export default Login;

/* ---------- STYLES ---------- */
const Wrapper = tw.div`min-h-screen flex items-center justify-center bg-gray-100 p-4`;
const Card = tw.div`bg-white w-full max-w-md rounded-lg flex flex-col p-6 shadow-md`;
const Title = tw.h1`text-2xl font-bold text-center mb-6`;
const InputGroup = tw.div`mb-4`;
const InputLabel = tw.label`block text-sm font-medium text-gray-700 mb-1`;
const Input = tw.input`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100`;
const PrimaryButton = tw.button`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-3`;
const Divider = tw.div`text-center text-gray-500 my-2`;
const GoogleButton = tw.button`w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`;
const ErrorText = tw.p`text-red-500 text-sm text-center mb-2`;
