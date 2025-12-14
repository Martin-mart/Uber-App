import React, { useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';

const Map = ({ pickupCoordinates, dropoffCoordinates }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      if (!mapContainer.current) return;

      if (!mapInstance.current) {
        mapInstance.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: pickupCoordinates || [0, 0],
          zoom: 12,
        });
      }

      const map = mapInstance.current;

      if (!map.markers) map.markers = [];
      map.markers.forEach((m) => m.remove());
      map.markers = [];

      const addMarker = (coords) => {
        const marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
        map.markers.push(marker);
      };

      if (pickupCoordinates) addMarker(pickupCoordinates);
      if (dropoffCoordinates) addMarker(dropoffCoordinates);

      if (pickupCoordinates && dropoffCoordinates) {
        map.fitBounds([pickupCoordinates, dropoffCoordinates], { padding: 60 });
      } else if (pickupCoordinates) {
        map.setCenter(pickupCoordinates);
      }
    };

    initMap();
  }, [pickupCoordinates, dropoffCoordinates]);

  return <MapWrapper ref={mapContainer} />;
};

export default Map;

const MapWrapper = tw.div`
  w-full h-96 sm:h-[500px] relative
`;
