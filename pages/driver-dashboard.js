import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import ProfileContainer from '../components/profileContainer';

const DriverDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) return router.push('/login');

      const snap = await getDoc(doc(db, 'users', u.uid));
      const data = snap.data();
      if (!data.isApproved) return alert('Awaiting admin approval');

      setUser({ uid: u.uid, ...data });
      fetchRides(u.uid);
      if (data.documents) setDocuments(data.documents);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchRides = async (driverId) => {
    const q = query(collection(db, 'rides'), where('driverId', '==', driverId));
    const snap = await getDocs(q);
    setRides(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleDocumentUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    // For simplicity, we just save file.name
    const updatedDocs = { ...documents, [type]: file.name };
    setDocuments(updatedDocs);
    await updateDoc(doc(db, 'users', user.uid), { documents: updatedDocs });
  };

  const totalEarnings = rides.reduce((acc, r) => acc + (r.price || 0), 0);

  if (loading) return <LoadingText>Loading...</LoadingText>;

  return (
    <Wrapper>
      <ProfileContainer />
      <Section>
        <SectionTitle>Your Earnings</SectionTitle>
        <Earnings>${totalEarnings.toFixed(2)}</Earnings>
      </Section>

      <Section>
        <SectionTitle>Upload Documents</SectionTitle>
        <DocumentLabel>ID</DocumentLabel>
        <input type="file" onChange={(e) => handleDocumentUpload(e, 'id')} />
        <DocumentLabel>Car Photo</DocumentLabel>
        <input type="file" onChange={(e) => handleDocumentUpload(e, 'car')} />
        <DocumentLabel>Insurance</DocumentLabel>
        <input type="file" onChange={(e) => handleDocumentUpload(e, 'insurance')} />
      </Section>

      <Section>
        <SectionTitle>Your Rides</SectionTitle>
        <Table>
          <thead>
            <tr>
              <th>User</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rides.map(r => (
              <tr key={r.id}>
                <td>{r.userName}</td>
                <td>{r.pickup}</td>
                <td>{r.dropoff}</td>
                <td>{r.price}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Wrapper>
  );
};

export default DriverDashboard;

/* Styles */
const Wrapper = tw.div`min-h-screen p-6 bg-gray-100 flex flex-col gap-6`;
const Section = tw.div`bg-white p-4 rounded shadow`;
const SectionTitle = tw.h2`font-bold mb-2`;
const Earnings = tw.p`text-xl font-semibold`;
const DocumentLabel = tw.label`block mt-2 font-medium`;
const Table = tw.table`min-w-full bg-gray-50 rounded shadow overflow-hidden`;
const LoadingText = tw.p`text-center text-gray-500 text-lg mt-8`;
