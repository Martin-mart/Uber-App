import React, { useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';

const Map = ({ pickupCoordinates, dropoffCoordinates }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Ensure client-side

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      if (!mapContainer.current) return;

      // Initialize map only once
      if (!mapInstance.current) {
        mapInstance.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: pickupCoordinates || [0, 0],
          zoom: 12,
        });
      }

      const map = mapInstance.current;

      // Clear previous markers
      map.markers?.forEach((m) => m.remove());
      map.markers = [];

      const addMarker = (coords) => {
        const marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
        map.markers.push(marker);
      };

      if (pickupCoordinates) addMarker(pickupCoordinates);
      if (dropoffCoordinates) addMarker(dropoffCoordinates);

      // Fit bounds if both points exist
      if (pickupCoordinates && dropoffCoordinates) {
        map.fitBounds([pickupCoordinates, dropoffCoordinates], { padding: 60 });
      }
    };

    initMap();
  }, [pickupCoordinates, dropoffCoordinates]);

  return <MapWrapper ref={mapContainer} />;
};

export default Map;

const MapWrapper = tw.div`
  flex-1 h-64 sm:h-96 w-full
`;
