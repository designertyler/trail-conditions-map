import * as React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import type { Trail } from '../types/trail';

const getStatusIcon = (status: string) => {
  const iconMap: { [key: string]: string } = {
    open: '/icons/pin-open/pin-open-96.png',
    closed: '/icons/pin-closed/pin-closed-96.png',
    "wet, don't ride": '/icons/pin-wet/pin-wet-96.png',
    'needs update': '/icons/pin-update/pin-update-96.png',
  };

  return L.icon({
    iconUrl: iconMap[status] || '/icons/pin-update/pin-update-96.png',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const AUSTIN_CENTER: LatLngExpression = [30.2672, -97.7431];
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

const TrailMap: React.FC = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrails() {
      // Check cache first
      const cachedTrails = localStorage.getItem('trails');
      const cacheTimestamp = localStorage.getItem('trails_timestamp');
      const now = Date.now();

      if (
        cachedTrails &&
        cacheTimestamp &&
        now - parseInt(cacheTimestamp) < 30 * 60 * 1000
      ) {
        setTrails(JSON.parse(cachedTrails));
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch('http://localhost:3001/api/trails');
        const data = await response.json();

        const formattedTrails: Trail[] = data.map((trail: any) => ({
          id: trail.id,
          name: trail.name,
          position: [trail.latitude, trail.longitude] as LatLngExpression,
          status: trail.status,
          lastUpdated: trail.last_updated,
        }));

        // Cache the data
        localStorage.setItem('trails', JSON.stringify(formattedTrails));
        localStorage.setItem('trails_timestamp', now.toString());

        setTrails(formattedTrails);
      } catch (error) {
        console.error('Failed to fetch trails:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchTrails();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {loading && <div className="loading-popup">Loading trails...</div>}

      <MapContainer
        center={AUSTIN_CENTER}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="© MapTiler © OpenStreetMap contributors"
          url={`https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />

        {trails.map((trail) => (
          <Marker
            key={trail.id}
            position={trail.position}
            icon={getStatusIcon(trail.status)}
          >
            <Popup>
              <h3>{trail.name}</h3>
              <p>Status: {trail.status}</p>
              <p>Updated: {trail.lastUpdated}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrailMap;
