import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import tw from 'tailwind-styled-components';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';

export default function Receipt() {
  const router = useRouter();
  const { rideId } = router.query;

  const [ride, setRide] = useState(null);
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!rideId || !auth.currentUser) return;

    const rideDoc = doc(db, 'users', auth.currentUser.uid, 'rides', rideId);
    getDoc(rideDoc).then((docSnap) => {
      if (docSnap.exists()) {
        setRide(docSnap.data());
      } else {
        console.log('No such ride!');
      }
    });
  }, [rideId]);

  // Initialize Mapbox with ride route
  useEffect(() => {
    if (!ride?.route?.length || !mapContainer.current) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: ride.route[0],
        zoom: 12,
      });
    }

    const map = mapRef.current;

    // Add route
    const geojson = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: ride.route },
    };

    map.on('load', () => {
      if (!map.getSource('route')) {
        map.addSource('route', { type: 'geojson', data: geojson });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#1DB954', 'line-width': 4 },
        });
      }
    });

    // Add markers
    new mapboxgl.Marker({ color: 'green' }).setLngLat(ride.route[0]).addTo(map);
    new mapboxgl.Marker({ color: 'red' }).setLngLat(ride.route[ride.route.length - 1]).addTo(map);

    return () => map.remove();
  }, [ride]);

  if (!ride) return <Loading>Loading ride...</Loading>;

  return (
    <Wrapper>
      <Header>Ride Receipt</Header>

      <MapContainer ref={mapContainer} />

      <RideDetails>
        <DetailRow>
          <Label>Pickup:</Label>
          <Value>{ride.pickup}</Value>
        </DetailRow>
        <DetailRow>
          <Label>Dropoff:</Label>
          <Value>{ride.dropoff}</Value>
        </DetailRow>
        <DetailRow>
          <Label>Date/Time:</Label>
          <Value>{new Date(ride.timestamp.seconds * 1000).toLocaleString()}</Value>
        </DetailRow>

        <DriverInfo>
          <DriverPhoto src={ride.driver.photoUrl} />
          <DriverName>{ride.driver.name}</DriverName>
        </DriverInfo>

        <FareBreakdown>
          <DetailRow>
            <Label>Base Fare:</Label>
            <Value>Ksh {(ride.fare * 0.6).toFixed(2)}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Distance/Time:</Label>
            <Value>Ksh {(ride.fare * 0.3).toFixed(2)}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Tax:</Label>
            <Value>Ksh {(ride.fare * 0.1).toFixed(2)}</Value>
          </DetailRow>
          <DetailRow className="font-bold">
            <Label>Total:</Label>
            <Value>Ksh {ride.fare.toFixed(2)}</Value>
          </DetailRow>
        </FareBreakdown>

        <PaymentMethod>Paid with: {ride.paymentMethod}</PaymentMethod>
      </RideDetails>
    </Wrapper>
  );
}

/* Styled Components */
const Wrapper = tw.div`p-4 bg-gray-50 min-h-screen flex flex-col`;
const Header = tw.h1`text-2xl font-bold mb-4 text-center`;
const MapContainer = tw.div`w-full h-64 sm:h-96 rounded-lg shadow mb-4`;
const RideDetails = tw.div`bg-white rounded-lg shadow p-4 flex flex-col space-y-4`;

const DetailRow = tw.div`flex justify-between`;
const Label = tw.div`text-gray-500`;
const Value = tw.div`text-gray-800 font-medium`;

const DriverInfo = tw.div`flex items-center space-x-3`;
const DriverPhoto = tw.img`h-12 w-12 rounded-full`;
const DriverName = tw.div`font-medium`;

const FareBreakdown = tw.div`flex flex-col space-y-2`;
const PaymentMethod = tw.div`text-gray-500 text-sm text-center`;

const Loading = tw.div`text-center text-gray-500 mt-20 text-lg`;
