import { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const ProfileContainer = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) return router.push('/login');
      const snap = await getDoc(doc(db, 'users', u.uid));
      setUser({ uid: u.uid, ...snap.data() });
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const goToDashboard = () => {
    if (user.role === 'admin') router.push('/admin');
    else if (user.role === 'driver') router.push('/driver-dashboard');
    else router.push('/');
  };

  if (!user) return null;

  return (
    <Container>
      <UserName>{user.displayName}</UserName>
      <Actions>
        <ActionButton onClick={goToDashboard}>Dashboard</ActionButton>
        <ActionButton onClick={handleLogout}>Logout</ActionButton>
      </Actions>
    </Container>
  );
};

export default ProfileContainer;

/* Styles */
const Container = tw.div`bg-white p-4 rounded shadow flex flex-col items-center`;
const UserName = tw.p`font-bold mb-2`;
const Actions = tw.div`flex flex-col gap-2`;
const ActionButton = tw.button`bg-black text-white py-2 px-4 rounded hover:bg-gray-800`;
