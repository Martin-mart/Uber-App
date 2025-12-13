import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import tw from 'tailwind-styled-components';

mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';

export default function MapPreview({ route }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || !route?.length) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: route[0],
        zoom: 12,
      });
    }

    const map = mapRef.current;

    // Remove existing markers & lines
    map.eachLayer((layer) => {
      if (layer.id.startsWith('route')) map.removeLayer(layer.id);
    });

    // Draw route
    const geojson = {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: route },
    };

    map.on('load', () => {
      map.addSource(`route-${Date.now()}`, { type: 'geojson', data: geojson });
      map.addLayer({
        id: `route-${Date.now()}`,
        type: 'line',
        source: `route-${Date.now()}`,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#1DB954', 'line-width': 4 },
      });
    });

    return () => map.remove();
  }, [route]);

  return <MapContainer ref={mapContainer} />;
}

const MapContainer = tw.div`w-full h-32 rounded-lg shadow-sm`;
