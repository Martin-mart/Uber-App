import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg';

const History = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingMap, setRatingMap] = useState({}); // store ratings per ride

  // Real-time Firestore listener
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const q = query(
      collection(db, 'rides'),
      where('user', '==', user.email),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rideData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRides(rideData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRatingChange = async (rideId, value) => {
    setRatingMap({ ...ratingMap, [rideId]: value });

    const rideRef = doc(db, 'rides', rideId);
    await updateDoc(rideRef, { rating: value });
  };

  const openMapPreview = (pickup, dropoff) => {
    const mapWindow = window.open('', '_blank', 'width=600,height=400');
    const mapContainer = mapWindow.document.createElement('div');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    mapWindow.document.body.appendChild(mapContainer);

    new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: pickup,
      zoom: 12,
    })
      .addControl(new mapboxgl.NavigationControl())
      .setLngLat(pickup)
      .addTo(mapContainer);
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
        <p>Loading ride history...</p>
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => router.back()}>←</BackButton>
        <Title>Your Trips</Title>
      </Header>

      {rides.length === 0 ? (
        <EmptyState>
          <p>No rides yet</p>
          <button onClick={() => router.push('/')}>Book a ride</button>
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

              {/* Map preview button */}
              <MapPreviewButton onClick={() => openMapPreview(ride.pickup, ride.dropoff)}>
                View Map
              </MapPreviewButton>

              <Divider />

              <Footer>
                <Status>{ride.status || 'Completed'}</Status>
                <DateText>{ride.createdAt?.toDate().toLocaleString()}</DateText>
              </Footer>

              {/* Payment info */}
              <PaymentInfo>
                💳 Paid: {ride.payment?.method || 'N/A'} - Ksh {ride.payment?.amount || '0.00'}
              </PaymentInfo>

              {/* Rate your driver */}
              <RatingContainer>
                ⭐ Rate driver:
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    filled={ratingMap[ride.id] >= star || ride.rating >= star}
                    onClick={() => handleRatingChange(ride.id, star)}
                  >
                    ★
                  </Star>
                ))}
              </RatingContainer>
            </RideCard>
          ))}
        </RideList>
      )}
    </Wrapper>
  );
};

export default History;

/* ---------- STYLES ---------- */

const Wrapper = tw.div`min-h-screen bg-gray-100 p-2`;

const Header = tw.div`bg-white flex items-center p-4 shadow-sm`;
const BackButton = tw.button`text-xl mr-4`;
const Title = tw.h1`text-lg font-semibold`;

const RideList = tw.div`p-2 space-y-4`;

const RideCard = tw.div`bg-white p-4 rounded-xl shadow-md`;
const Row = tw.div`flex justify-between`;
const Location = tw.div`text-sm`;
const Coords = tw.p`text-gray-500 text-xs`;
const Divider = tw.hr`my-3 border-gray-300`;

const Footer = tw.div`flex justify-between items-center`;
const Status = tw.span`text-xs bg-green-100 text-green-700 px-2 py-1 rounded`;
const DateText = tw.span`text-xs text-gray-500`;

const EmptyState = tw.div`h-[60vh] flex flex-col items-center justify-center gap-4`;
const LoadingWrapper = tw.div`h-screen flex flex-col items-center justify-center`;
const Spinner = tw.div`h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4`;

const MapPreviewButton = tw.button`
bg-blue-500 text-white py-2 px-4 rounded-lg w-full mb-2 hover:bg-blue-600
`;

const PaymentInfo = tw.div`text-gray-700 text-sm mt-2`;

const RatingContainer = tw.div`flex items-center mt-2 gap-1`;
const Star = tw.span`
text-xl cursor-pointer
${(p) => (p.filled ? 'text-yellow-400' : 'text-gray-300')}
`;
