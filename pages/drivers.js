import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import { useDriverNotifications } from '../hooks/driverNotifications';
import tw from 'tailwind-styled-components';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const DriversDashboard = () => {

  useDriverNotifications()
  const router = useRouter();
  const user = auth.currentUser;

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(0);

  // Fetch real-time ride requests assigned to this driver
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const q = query(collection(db, 'rides'), where('driver', '==', user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rideData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRides(rideData);

      // Calculate total earnings
      const total = rideData.reduce((acc, ride) => acc + (ride.payment?.amount || 0), 0);
      setEarnings(total);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateRideStatus = async (rideId, status) => {
    const rideRef = doc(db, 'rides', rideId);
    await updateDoc(rideRef, { status });
  };

  const openMapPreview = (pickup, dropoff) => {
    const mapWindow = window.open('', '_blank', 'width=600,height=400');
    const mapContainer = mapWindow.document.createElement('div');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    mapWindow.document.body.appendChild(mapContainer);

    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: pickup,
      zoom: 12,
    });

    new mapboxgl.Marker({ color: 'green' }).setLngLat(pickup).addTo(map);
    new mapboxgl.Marker({ color: 'red' }).setLngLat(dropoff).addTo(map);
    map.addControl(new mapboxgl.NavigationControl());
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
        <p>Loading rides...</p>
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <Title>Driver Dashboard</Title>
        <Earnings>Total Earnings: Ksh {earnings.toFixed(2)}</Earnings>
      </Header>

      {rides.length === 0 ? (
        <EmptyState>
          <p>No assigned rides currently</p>
        </EmptyState>
      ) : (
        <RideList>
          {rides.map((ride) => (
            <RideCard key={ride.id}>
              <Row>
                <Location>
                  📍 Pickup: <Coords>{ride.pickup?.join(', ')}</Coords>
                </Location>
                <Location>
                  🏁 Dropoff: <Coords>{ride.dropoff?.join(', ')}</Coords>
                </Location>
              </Row>

              <Divider />

              <MapPreviewButton onClick={() => openMapPreview(ride.pickup, ride.dropoff)}>
                View Map
              </MapPreviewButton>

              <StatusContainer>
                <Status>Current Status: {ride.status || 'Pending'}</Status>
                <StatusButtons>
                  <Button onClick={() => updateRideStatus(ride.id, 'En Route')}>En Route</Button>
                  <Button onClick={() => updateRideStatus(ride.id, 'Picked Up')}>Picked Up</Button>
                  <Button onClick={() => updateRideStatus(ride.id, 'Completed')}>Completed</Button>
                </StatusButtons>
              </StatusContainer>

              <PaymentInfo>
                💳 Fare: {ride.payment?.method || 'N/A'} - Ksh {ride.payment?.amount || '0.00'}
              </PaymentInfo>
            </RideCard>
          ))}
        </RideList>
      )}
    </Wrapper>
  );
};

export default DriversDashboard;

/* ---------------- STYLES ---------------- */

const Wrapper = tw.div`min-h-screen bg-gray-100 p-2`;
const Header = tw.div`bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-center mb-4`;
const Title = tw.h1`text-xl font-semibold`;
const Earnings = tw.span`text-green-600 font-bold`;

const RideList = tw.div`space-y-4`;
const RideCard = tw.div`bg-white p-4 rounded-xl shadow-md`;
const Row = tw.div`flex justify-between`;
const Location = tw.div`text-sm`;
const Coords = tw.p`text-gray-500 text-xs`;
const Divider = tw.hr`my-3 border-gray-300`;

const MapPreviewButton = tw.button`bg-blue-500 text-white py-2 px-4 rounded-lg w-full mb-2 hover:bg-blue-600`;

const StatusContainer = tw.div`flex flex-col gap-2 mt-2`;
const Status = tw.span`text-gray-800 font-medium`;
const StatusButtons = tw.div`flex gap-2 flex-wrap`;
const Button = tw.button`bg-gray-200 py-1 px-2 rounded hover:bg-gray-300 text-sm`;

const PaymentInfo = tw.div`text-gray-700 text-sm mt-2`;

const EmptyState = tw.div`h-[60vh] flex flex-col items-center justify-center gap-4`;
const LoadingWrapper = tw.div`h-screen flex flex-col items-center justify-center`;
const Spinner = tw.div`h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4`;
