import { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const Admin = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }

      // Fetch user role
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        router.push('/');
        return;
      }

      setUser(currentUser);
      fetchDrivers();
    });

    return () => unsubscribe();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const driverData = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((u) => u.role === 'driver');
    setDrivers(driverData);
    setLoading(false);
  };

  const approveDriver = async (driverId) => {
    await updateDoc(doc(db, 'users', driverId), { approved: true });
    fetchDrivers();
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <LoadingText>Loading drivers...</LoadingText>;

  return (
    <Wrapper>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <DriverTable>
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Plate</th>
            <th>Vehicle</th>
            <th>Seats</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.displayName}</td>
              <td>{driver.driverInfo?.fullName || '-'}</td>
              <td>{driver.driverInfo?.plateNumber || '-'}</td>
              <td>{driver.driverInfo?.vehicleType || '-'}</td>
              <td>{driver.driverInfo?.seats || '-'}</td>
              <td>{driver.approved ? 'Yes' : 'No'}</td>
              <td>
                {!driver.approved && (
                  <ActionButton onClick={() => approveDriver(driver.id)}>
                    Approve
                  </ActionButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </DriverTable>
    </Wrapper>
  );
};

export default Admin;

/* ---------- STYLES ---------- */
const Wrapper = tw.div`min-h-screen p-6 bg-gray-100`;
const Header = tw.div`flex justify-between items-center mb-6`;
const Title = tw.h1`text-2xl font-bold`;
const LogoutButton = tw.button`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600`;

const DriverTable = tw.table`min-w-full bg-white rounded-lg shadow overflow-hidden`;
const ActionButton = tw.button`bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600`;

const LoadingText = tw.p`text-center text-gray-500 mt-8 text-lg`;
