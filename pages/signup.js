import { useState } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, db, storage, provider } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const router = useRouter();

  const [accountType, setAccountType] = useState('customer');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [seats, setSeats] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [idPhoto, setIdPhoto] = useState(null);
  const [idPreview, setIdPreview] = useState('');
  const [carPhoto, setCarPhoto] = useState(null);
  const [carPhotoPreview, setCarPhotoPreview] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (setter, previewSetter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      if (previewSetter) {
        const reader = new FileReader();
        reader.onloadend = () => previewSetter(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !username) return;
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Profile Photo
      let photoURL = '';
      if (profilePhoto) {
        const storageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(storageRef, profilePhoto);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: username, photoURL });

      let driverInfo = null;
      if (accountType === 'driver') {
        const idRef = ref(storage, `drivers/${user.uid}/id`);
        const carRef = ref(storage, `drivers/${user.uid}/car`);
        const licenseRef = ref(storage, `drivers/${user.uid}/license`);
        const insuranceRef = ref(storage, `drivers/${user.uid}/insurance`);

        await uploadBytes(idRef, idPhoto);
        await uploadBytes(carRef, carPhoto);
        await uploadBytes(licenseRef, licenseFile);
        await uploadBytes(insuranceRef, insuranceFile);

        driverInfo = {
          fullName,
          plateNumber,
          vehicleType,
          seats,
          idPhotoURL: await getDownloadURL(idRef),
          carPhotoURL: await getDownloadURL(carRef),
          licenseURL: await getDownloadURL(licenseRef),
          insuranceURL: await getDownloadURL(insuranceRef),
        };
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: username,
        email,
        photoURL,
        role: accountType,
        approved: accountType === 'driver' ? false : true,
        driverInfo: driverInfo || null,
        createdAt: new Date(),
      });

      router.push(accountType === 'driver' ? '/login' : '/user-dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Google signups are always customers
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'customer',
        approved: true,
        createdAt: new Date(),
      }, { merge: true });

      router.push('/user-dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <Card>
        <Header>
          <UberLogo src="https://i.ibb.co/ZMhy8ws/uber-logo.png" />
        </Header>

        <Title>Create your account</Title>

        <InputGroup>
          <InputLabel>Account Type</InputLabel>
          <select value={accountType} onChange={(e) => setAccountType(e.target.value)} disabled={loading} className="w-full border rounded px-3 py-2">
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
          </select>
        </InputGroup>

        <InputGroup>
          <InputLabel>Username</InputLabel>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading}/>
        </InputGroup>

        <InputGroup>
          <InputLabel>Email</InputLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}/>
        </InputGroup>

        <InputGroup>
          <InputLabel>Password</InputLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}/>
        </InputGroup>

        {accountType === 'driver' && (
          <>
            <InputGroup>
              <InputLabel>Full Name (as per ID)</InputLabel>
              <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading}/>
            </InputGroup>

            <PhotoUploadSection>
              <PhotoLabel>ID Photo</PhotoLabel>
              <PhotoContainer>
                <PhotoPreview src={idPreview} />
                <HiddenFileInput type="file" accept="image/*" onChange={handleFileChange(setIdPhoto, setIdPreview)} id="idPhoto"/>
                <PhotoUploadButton htmlFor="idPhoto" disabled={loading}>Choose ID Photo</PhotoUploadButton>
              </PhotoContainer>
            </PhotoUploadSection>

            <PhotoUploadSection>
              <PhotoLabel>Car Photo</PhotoLabel>
              <PhotoContainer>
                <PhotoPreview src={carPhotoPreview} />
                <HiddenFileInput type="file" accept="image/*" onChange={handleFileChange(setCarPhoto, setCarPhotoPreview)} id="carPhoto"/>
                <PhotoUploadButton htmlFor="carPhoto" disabled={loading}>Choose Car Photo</PhotoUploadButton>
              </PhotoContainer>
            </PhotoUploadSection>

            <InputGroup>
              <InputLabel>Plate Number</InputLabel>
              <Input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} disabled={loading}/>
            </InputGroup>

            <InputGroup>
              <InputLabel>Vehicle Type</InputLabel>
              <Input type="text" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} disabled={loading}/>
            </InputGroup>

            <InputGroup>
              <InputLabel>Number of Seats</InputLabel>
              <Input type="number" value={seats} onChange={(e) => setSeats(e.target.value)} disabled={loading}/>
            </InputGroup>

            <InputGroup>
              <InputLabel>Driving License (PDF)</InputLabel>
              <Input type="file" accept="application/pdf" onChange={handleFileChange(setLicenseFile)} disabled={loading}/>
            </InputGroup>

            <InputGroup>
              <InputLabel>Proof of Insurance (PDF)</InputLabel>
              <Input type="file" accept="application/pdf" onChange={handleFileChange(setInsuranceFile)} disabled={loading}/>
            </InputGroup>
          </>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <PrimaryButton onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </PrimaryButton>

        <Divider>OR</Divider>

        {accountType === 'customer' && (
          <GoogleButton onClick={handleGoogleSignup} disabled={loading}>
            Sign up with Google
          </GoogleButton>
        )}
      </Card>
    </Wrapper>
  );
};

export default Signup;

/* --------- STYLES --------- */
const Wrapper = tw.div`min-h-screen flex items-center justify-center bg-white p-4`;
const Card = tw.div`bg-white w-full max-w-lg rounded-lg flex flex-col p-6`;
const Header = tw.div`flex justify-center mb-6`;
const UberLogo = tw.img`h-8 w-auto`;
const Title = tw.h1`text-2xl font-bold text-gray-900 mb-4 text-center`;
const InputGroup = tw.div`mb-4`;
const InputLabel = tw.label`block text-sm font-medium text-gray-700 mb-1`;
const Input = tw.input`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100`;
const PhotoUploadSection = tw.div`mb-4`;
const PhotoLabel = tw.label`block text-sm font-medium text-gray-700 mb-2`;
const PhotoContainer = tw.div`flex flex-col items-center mb-2`;
const PhotoPreview = tw.img`h-24 w-24 rounded-full border-2 border-gray-200 object-cover mb-2`;
const HiddenFileInput = tw.input`hidden`;
const PhotoUploadButton = tw.label`text-sm font-medium text-black cursor-pointer hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed`;
const PrimaryButton = tw.button`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-2`;
const Divider = tw.div`text-center text-gray-500 my-2`;
const ErrorText = tw.p`text-red-500 text-sm text-center mb-2`;
const GoogleButton = tw.button`w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`;
