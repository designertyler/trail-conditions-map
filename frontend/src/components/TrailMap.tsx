import * as React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import type { Trail } from '../types/trail';
import { supabase } from '../utils/supabase';

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
      setLoading(true);
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error:', error);
        setLoading(false);
        return;
      }

      const formattedTrails: Trail[] = data.map((trail: any) => ({
        id: trail.id,
        name: trail.name,
        position: [trail.latitude, trail.longitude] as LatLngExpression,
        status: trail.status,
        lastUpdated: trail.last_updated,
      }));

      setTrails(formattedTrails);
      setLoading(false);
    }

    fetchTrails().catch(console.error);
  }, []);

  console.log('Loading state:', loading);

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
