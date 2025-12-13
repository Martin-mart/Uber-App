import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/router';
import RideSelector from './components/RideSelector';

const Confirm = () => {
  const router = useRouter();
  const { pickup, dropoff } = router.query;

  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Fetch coordinates
  const getCoordinates = async (location, setter) => {
    if (!location) return;
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?` +
        new URLSearchParams({
          access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
          limit: 1,
        })
    );
    const data = await res.json();
    if (data.features && data.features[0]) setter(data.features[0].center);
  };

  // Get pickup & dropoff coordinates
  useEffect(() => {
    if (!pickup || !dropoff) return;

    Promise.all([
      getCoordinates(pickup, setPickupCoordinates),
      getCoordinates(dropoff, setDropoffCoordinates),
    ]).then(() => setLoading(false));
  }, [pickup, dropoff]);

  // Initialize Map
  useEffect(() => {
    if (!pickupCoordinates || !dropoffCoordinates || typeof window === 'undefined') return;

    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      // Remove previous map if exists
      if (mapInstance.current) mapInstance.current.remove();

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: pickupCoordinates,
        zoom: 12,
      });

      new mapboxgl.Marker({ color: 'green' }).setLngLat(pickupCoordinates).addTo(map);
      new mapboxgl.Marker({ color: 'red' }).setLngLat(dropoffCoordinates).addTo(map);

      map.fitBounds([pickupCoordinates, dropoffCoordinates], { padding: 60 });

      mapInstance.current = map;
    });
  }, [pickupCoordinates, dropoffCoordinates]);

  const confirmRide = () => {
    router.push({
      pathname: '/ride',
      query: {
        pickupLng: pickupCoordinates[0],
        pickupLat: pickupCoordinates[1],
        dropoffLng: dropoffCoordinates[0],
        dropoffLat: dropoffCoordinates[1],
      },
    });
  };

  if (loading)
    return (
      <LoadingWrapper>
        <Spinner />
        <p>Calculating route...</p>
      </LoadingWrapper>
    );

  return (
    <Wrapper>
      {/* Back Button */}
      <ButtonContainer>
        <Link href="/search">
          <BackButton src="https://img.icons8.com/ios-filled/50/000000/left.png" />
        </Link>
      </ButtonContainer>

      {/* Map */}
      <MapContainer ref={mapContainer} />

      {/* Ride Options */}
      <RideContainer>
        <RideSelector pickupCoordinates={pickupCoordinates} dropoffCoordinates={dropoffCoordinates} />
        <ConfirmButtonContainer>
          <ConfirmButton onClick={confirmRide}>Confirm Uber</ConfirmButton>
        </ConfirmButtonContainer>
      </RideContainer>
    </Wrapper>
  );
};

export default Confirm;

/* ---------------- STYLES ---------------- */
const Wrapper = tw.div`h-screen flex flex-col bg-blue-50`;
const MapContainer = tw.div`w-full h-64 sm:h-96 md:h-[500px]`;
const RideContainer = tw.div`flex-1 flex flex-col`;
const ConfirmButtonContainer = tw.div`border-t border-gray-200`;
const ConfirmButton = tw.button`bg-black text-white text-center py-4 m-4 text-lg rounded-lg active:scale-95 transition`;
const ButtonContainer = tw.div`bg-white px-4 rounded-full absolute top-4 left-4 z-10 shadow-md`;
const BackButton = tw.img`h-8 w-8 cursor-pointer`;
const LoadingWrapper = tw.div`h-screen flex flex-col items-center justify-center`;
const Spinner = tw.div`h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4`;
