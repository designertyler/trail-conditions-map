import * as React from 'react';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Trail } from '../types/trail';
import mockTrails from '../data/mockTrails';
import { TrailSidePanel } from './TrailSidePanel';

const getStatusIcon = (status: string) => {
  const iconMap: { [key: string]: string } = {
    open: '/icons/pin-open/pin-open-96.png',
    closed: '/icons/pin-closed/pin-closed-96.png',
    "wet, don't ride": '/icons/pin-wet/pin-wet-96.png',
    'update needed': '/icons/pin-update/pin-update-96.png',
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
  const [trails] = useState<Trail[]>(mockTrails);
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const visibleTrails = activeTab === 'open'
    ? trails.filter(t => t.status === 'open')
    : trails;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && <div className="loading-popup">Loading trails...</div>}

      {/* Side panel overlay */}
      <div className="absolute top-8 left-8 right-8 sm:right-auto bottom-8 z-[1000] flex flex-col">
        <TrailSidePanel trails={trails} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <MapContainer
        center={AUSTIN_CENTER}
        zoom={11}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution="© MapTiler © OpenStreetMap contributors"
          url={`https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
        />

        {visibleTrails.map((trail) => (
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
