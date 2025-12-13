import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Ride = () => {
  const router = useRouter();
  const { pickupLng, pickupLat, dropoffLng, dropoffLat } = router.query;

  const mapRef = useRef(null);
  const driverMarker = useRef(null);

  const [loading, setLoading] = useState(true);
  const [driverArrived, setDriverArrived] = useState(false);

  // Save ride to Firebase
  useEffect(() => {
    if (!pickupLng || !dropoffLng) return;

    addDoc(collection(db, 'rides'), {
      user: auth.currentUser?.email,
      pickup: [pickupLng, pickupLat],
      dropoff: [dropoffLng, dropoffLat],
      status: 'on-the-way',
      createdAt: serverTimestamp(),
    });
  }, [pickupLng, dropoffLng]);

  // Initialize map + driver animation
  useEffect(() => {
    if (!pickupLng || !dropoffLng) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [pickupLng, pickupLat],
      zoom: 14,
    });

    const pickup = [pickupLng, pickupLat];
    const dropoff = [dropoffLng, dropoffLat];

    new mapboxgl.Marker({ color: 'green' }).setLngLat(pickup).addTo(map);
    new mapboxgl.Marker({ color: 'red' }).setLngLat(dropoff).addTo(map);

    // Driver marker
    driverMarker.current = new mapboxgl.Marker({ color: 'black' })
      .setLngLat([pickupLng - 0.01, pickupLat - 0.01])
      .addTo(map);

    animateDriver(pickup);

    setLoading(false);
    return () => map.remove();
  }, [pickupLng, pickupLat, dropoffLng, dropoffLat]);

  // 🚗 Driver movement animation
  const animateDriver = (destination) => {
    let lng = pickupLng - 0.01;
    let lat = pickupLat - 0.01;

    const interval = setInterval(() => {
      lng += 0.0002;
      lat += 0.0002;

      driverMarker.current.setLngLat([lng, lat]);

      if (
        Math.abs(lng - destination[0]) < 0.0005 &&
        Math.abs(lat - destination[1]) < 0.0005
      ) {
        clearInterval(interval);
        setDriverArrived(true);
      }
    }, 100);
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
        <p>Finding your driver...</p>
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper>
      <Map ref={mapRef} />

      <BottomCard>
        <DriverInfo>
          <Avatar src="https://i.pravatar.cc/100" />
          <div>
            <p className="font-semibold">Alex • Toyota Prius</p>
            <p className="text-sm text-gray-500">
              {driverArrived ? 'Driver arrived' : 'On the way'}
            </p>
          </div>
        </DriverInfo>

        <CancelButton onClick={() => router.push('/')}>
          Cancel Ride
        </CancelButton>
      </BottomCard>
    </Wrapper>
  );
};

export default Ride;

const Wrapper = tw.div`
h-screen flex flex-col
`;

const Map = tw.div`
flex-1
`;

const BottomCard = tw.div`
bg-white p-4 shadow-lg rounded-t-3xl
`;

const DriverInfo = tw.div`
flex items-center gap-4
`;

const Avatar = tw.img`
h-14 w-14 rounded-full
`;

const CancelButton = tw.button`
mt-4 w-full bg-red-500 text-white py-3 rounded-lg text-lg
`;

const LoadingWrapper = tw.div`
h-screen flex flex-col items-center justify-center
`;

const Spinner = tw.div`
h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4
`;
