import { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const Admin = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protect route: only admins
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const tokenResult = await currentUser.getIdTokenResult();
      if (!tokenResult.claims.admin) {
        router.push('/'); // non-admin users redirected
        return;
      }

      setUser(currentUser);
      fetchRides();
    });

    return () => unsubscribe();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    const ridesRef = collection(db, 'rides');
    const ridesSnapshot = await getDocs(ridesRef);
    const ridesData = ridesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRides(ridesData);
    setLoading(false);
  };

  const handleStatusChange = async (rideId, status) => {
    const rideRef = doc(db, 'rides', rideId);
    await updateDoc(rideRef, { status });
    fetchRides(); // refresh
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <LoadingText>Loading rides...</LoadingText>;

  return (
    <Wrapper>
      <Header>
        <Title>Admin Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Log out</LogoutButton>
      </Header>

      <RideTable>
        <TableHeader>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Pickup</TableCell>
            <TableCell>Dropoff</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rides.map((ride) => (
            <TableRow key={ride.id}>
              <TableCell>{ride.userName || 'N/A'}</TableCell>
              <TableCell>{ride.pickup}</TableCell>
              <TableCell>{ride.dropoff}</TableCell>
              <TableCell>{ride.status || 'Pending'}</TableCell>
              <TableCell>
                <StatusButton
                  onClick={() => handleStatusChange(ride.id, 'Completed')}
                >
                  Mark Completed
                </StatusButton>
                <StatusButton
                  bg="bg-yellow-500"
                  onClick={() => handleStatusChange(ride.id, 'Cancelled')}
                >
                  Cancel
                </StatusButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </RideTable>
    </Wrapper>
  );
};

export default Admin;

/* ---------------- STYLES ---------------- */
const Wrapper = tw.div`min-h-screen p-6 bg-gray-100 flex flex-col`;
const Header = tw.div`flex justify-between items-center mb-6`;
const Title = tw.h1`text-2xl font-bold`;
const LogoutButton = tw.button`bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600`;

const RideTable = tw.table`min-w-full bg-white rounded-lg shadow overflow-hidden`;
const TableHeader = tw.thead`bg-gray-200`;
const TableBody = tw.tbody``;
const TableRow = tw.tr`border-b hover:bg-gray-50`;
const TableCell = tw.td`py-3 px-4 text-left`;

const StatusButton = tw.button`
bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mr-2
${(props) => props.bg || ''}
`;

const LoadingText = tw.p`text-center text-gray-500 text-lg mt-8`;
