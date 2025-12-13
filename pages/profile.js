import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';
import { auth, db, storage } from '../firebase';
import { updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          setUsername(userSnap.data().displayName);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleProfileUpdate = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    let photoURL = userData?.photoURL || '';

    try {
      // Upload new profile photo if selected
      if (profilePhoto) {
        const storageRef = ref(storage, `profiles/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, profilePhoto);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Auth
      await updateProfile(auth.currentUser, { displayName: username, photoURL });

      // Update Firestore
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        { displayName: username, photoURL },
        { merge: true }
      );

      setUserData({ ...userData, displayName: username, photoURL });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!userData) return <LoadingText>Loading...</LoadingText>;

  return (
    <Wrapper>
      <Card>
        <ProfileImage src={userData.photoURL || 'https://img.icons8.com/ios-filled/100/000000/user.png'} />
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <ProfilePhotoInput
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />
        <PrimaryButton onClick={handleProfileUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </PrimaryButton>

        <LogoutButton onClick={handleLogout}>Log out</LogoutButton>
      </Card>
    </Wrapper>
  );
};

export default Profile;

/* ---------- STYLES ---------- */

const Wrapper = tw.div`min-h-screen flex items-center justify-center bg-gray-100 p-4`;
const Card = tw.div`bg-white w-full max-w-md rounded-xl shadow-lg p-6 flex flex-col items-center`;
const ProfileImage = tw.img`h-24 w-24 rounded-full mb-4 object-cover`;
const Input = tw.input`border border-gray-300 rounded-md px-4 py-3 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-black`;
const ProfilePhotoInput = tw.input`mb-4`;
const PrimaryButton = tw.button`bg-black text-white py-3 rounded-md font-medium hover:bg-gray-900 transition disabled:opacity-50 w-full`;
const LogoutButton = tw.button`mt-4 bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition w-full`;
const LoadingText = tw.p`text-center text-gray-500 text-lg mt-8`;
