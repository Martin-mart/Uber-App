import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect logged-in users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/');
    });
    return unsubscribe;
  }, [router]);

  const handleEmailLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
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

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      router.push('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <Card>
        <Header>
          <UberLogo src="https://i.ibb.co/ZMhy8ws/uber-logo.png" alt="Uber" />
        </Header>

        <Title>Log in to your Uber account</Title>

        <InputGroup>
          <InputLabel>Email</InputLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </InputGroup>

        <InputGroup>
          <InputLabel>Password</InputLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </InputGroup>

        {error && <ErrorText>{error}</ErrorText>}

        <PrimaryButton onClick={handleEmailLogin} disabled={loading || !email || !password}>
          {loading ? 'Logging in...' : 'Log in'}
        </PrimaryButton>

        <Divider>
          <DividerLine />
          <DividerText>OR</DividerText>
          <DividerLine />
        </Divider>

        <GoogleButton onClick={handleGoogleLogin} disabled={loading}>
          <GoogleIcon src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
          Continue with Google
        </GoogleButton>

        <Footer>
          <FooterText>
            Don't have an account?{' '}
            <ClickableText onClick={() => router.push('/signup')}>Sign up</ClickableText>
          </FooterText>
          <FooterText>
            <ClickableText onClick={() => router.push('/forgot-password')}>Forgot Password?</ClickableText>
          </FooterText>
        </Footer>
      </Card>
    </Wrapper>
  );
};

export default Login;

/* ---------- STYLES ---------- */
const Wrapper = tw.div`min-h-screen flex items-center justify-center bg-white p-4`;
const Card = tw.div`bg-white w-full max-w-sm rounded-lg flex flex-col`;
const Header = tw.div`flex justify-center mb-6`;
const UberLogo = tw.img`h-8 w-auto`;
const Title = tw.h1`text-2xl font-bold text-gray-900 mb-8 text-center`;
const InputGroup = tw.div`mb-4`;
const InputLabel = tw.label`block text-sm font-medium text-gray-700 mb-2`;
const Input = tw.input`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed`;
const PrimaryButton = tw.button`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4`;
const Divider = tw.div`flex items-center justify-center mb-4`;
const DividerLine = tw.div`flex-1 h-px bg-gray-300`;
const DividerText = tw.span`px-4 text-sm text-gray-500`;
const GoogleButton = tw.button`w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`;
const GoogleIcon = tw.img`h-5 w-5`;
const ErrorText = tw.p`text-red-500 text-sm mb-3 text-center`;
const Footer = tw.div`mt-8 pt-6 border-t border-gray-100`;
const FooterText = tw.p`text-center text-gray-600 mb-3 last:mb-0`;
const ClickableText = tw.span`text-black font-medium cursor-pointer hover:underline`;
