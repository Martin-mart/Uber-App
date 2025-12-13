import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import tw from 'tailwind-styled-components';
import mapboxgl from 'mapbox-gl';
import { useRouter } from 'next/router';
import RideSelector from './components/RideSelector';

mapboxgl.accessToken =
  'pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg';

const Confirm = () => {
  const router = useRouter();
  const { pickup, dropoff } = router.query;

  const [pickupCoordinates, setPickupCoordinates] = useState([0, 0]);
  const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);

  const mapContainer = useRef(null);

  // Fetch coordinates from Mapbox API
  const getCoordinates = (location, setter) => {
    if (!location) return;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?` +
        new URLSearchParams({
          access_token:
            'pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg',
          limit: 1,
        })
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.features && data.features[0]) {
          setter(data.features[0].center);
        }
      });
  };

  useEffect(() => {
    getCoordinates(pickup, setPickupCoordinates);
    getCoordinates(dropoff, setDropoffCoordinates);
  }, [pickup, dropoff]);

  // Initialize Mapbox map
  useEffect(() => {
    if (!pickupCoordinates || !dropoffCoordinates) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: pickupCoordinates,
      zoom: 12,
    });

    // Add markers
    new mapboxgl.Marker().setLngLat(pickupCoordinates).addTo(map);
    new mapboxgl.Marker().setLngLat(dropoffCoordinates).addTo(map);

    // Resize map on window resize
    window.addEventListener('resize', () => map.resize());

    return () => map.remove();
  }, [pickupCoordinates, dropoffCoordinates]);

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
        <RideSelector
          pickupCoordinates={pickupCoordinates}
          dropoffCoordinates={dropoffCoordinates}
        />
        <ConfirmButtonContainer>
          <ConfirmButton>Confirm Uber</ConfirmButton>
        </ConfirmButtonContainer>
      </RideContainer>
    </Wrapper>
  );
};

export default Confirm;

/* Styled Components */
const Wrapper = tw.div`flex-1 h-screen bg-blue-50 flex flex-col overflow-y-scroll`;
const MapContainer = tw.div`w-full h-64 sm:h-96 md:h-[500px]`;
const RideContainer = tw.div`flex-1 flex flex-col`;
const ConfirmButtonContainer = tw.div`border-t-2 border-gray-200 flex-none`;
const ConfirmButton = tw.div`bg-black text-white text-center py-4 m-4 text-lg sm:text-xl cursor-pointer rounded-lg`;
const ButtonContainer = tw.div`bg-white px-4 rounded-full absolute top-4 left-4 z-10 shadow-md cursor-pointer`;
const BackButton = tw.img`h-8 sm:h-10 w-8 sm:w-10 object-contain cursor-pointer`;
