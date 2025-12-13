import { useState } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, provider, db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkPasswordStrength = (pwd) => {
    if (!pwd) return setPasswordStrength('');
    if (pwd.length < 6) return setPasswordStrength('Weak');
    if (pwd.length < 10) return setPasswordStrength('Medium');
    return setPasswordStrength('Strong');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = '';
      if (profilePhoto) {
        const storageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(storageRef, profilePhoto);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: username, photoURL });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: username,
        email,
        photoURL,
        createdAt: new Date(),
      });

      router.push('/');
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      }, { merge: true });

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

        <Title>Create your Uber account</Title>

        <PhotoUploadSection>
          <PhotoLabel>Profile Photo (Optional)</PhotoLabel>
          <PhotoContainer>
            <PhotoPreview src={photoPreview || "https://img.icons8.com/ios-filled/100/9CA3AF/user-male-circle.png"} />
            <HiddenFileInput type="file" accept="image/*" onChange={handlePhotoChange} disabled={loading} id="profilePhoto"/>
            <PhotoUploadButton htmlFor="profilePhoto" disabled={loading}>Choose Photo</PhotoUploadButton>
          </PhotoContainer>
        </PhotoUploadSection>

        <InputGroup>
          <InputLabel>Username</InputLabel>
          <Input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading}/>
        </InputGroup>

        <InputGroup>
          <InputLabel>Email</InputLabel>
          <Input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
        </InputGroup>

        <InputGroup>
          <InputLabel>Password</InputLabel>
          <Input type="password" placeholder="Enter password" value={password} onChange={(e) => { setPassword(e.target.value); checkPasswordStrength(e.target.value); }} disabled={loading}/>
          {passwordStrength && <PasswordStrength strength={passwordStrength}>{passwordStrength}</PasswordStrength>}
        </InputGroup>

        {error && <ErrorText>{error}</ErrorText>}

        <PrimaryButton onClick={handleSignup} disabled={loading || !email || !password || !username}>
          {loading ? 'Creating account...' : 'Sign up'}
        </PrimaryButton>

        <Divider>
          <DividerLine />
          <DividerText>OR</DividerText>
          <DividerLine />
        </Divider>

        <GoogleButton onClick={handleGoogleSignup} disabled={loading}>
          <GoogleIcon src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
          Sign up with Google
        </GoogleButton>

        <Footer>
          <FooterText>
            Already have an account? <ClickableText onClick={() => router.push('/login')}>Log in</ClickableText>
          </FooterText>
        </Footer>
      </Card>
    </Wrapper>
  );
};

export default Signup;

/* ---------- STYLES ---------- */
const Wrapper = tw.div`min-h-screen flex items-center justify-center bg-white p-4`;
const Card = tw.div`bg-white w-full max-w-sm rounded-lg flex flex-col`;
const Header = tw.div`flex justify-center mb-6`;
const UberLogo = tw.img`h-8 w-auto`;
const Title = tw.h1`text-2xl font-bold text-gray-900 mb-8 text-center`;
const PhotoUploadSection = tw.div`mb-6`;
const PhotoLabel = tw.label`block text-sm font-medium text-gray-700 mb-3`;
const PhotoContainer = tw.div`flex flex-col items-center`;
const PhotoPreview = tw.img`h-24 w-24 rounded-full border-2 border-gray-200 object-cover mb-3`;
const HiddenFileInput = tw.input`hidden`;
const PhotoUploadButton = tw.label`text-sm font-medium text-black cursor-pointer hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed`;
const InputGroup = tw.div`mb-4`;
const InputLabel = tw.label`block text-sm font-medium text-gray-700 mb-2`;
const Input = tw.input`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed`;
const PasswordStrength = tw.div`text-sm mb-2 text-center text-green-500`;
const ErrorText = tw.p`text-red-500 text-sm mb-3 text-center`;
const PrimaryButton = tw.button`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4`;
const Divider = tw.div`flex items-center justify-center mb-4`;
const DividerLine = tw.div`flex-1 h-px bg-gray-300`;
const DividerText = tw.span`px-4 text-sm text-gray-500`;
const GoogleButton = tw.button`w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`;
const GoogleIcon = tw.img`h-5 w-5`;
const Footer = tw.div`mt-8 pt-6 border-t border-gray-100`;
const FooterText = tw.p`text-center text-gray-600`;
const ClickableText = tw.span`text-black font-medium cursor-pointer hover:underline`;
