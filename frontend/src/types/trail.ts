import type { LatLngExpression } from 'leaflet';

export interface Trail {
  id: string;
  name: string;
  position: LatLngExpression;
  status: 'open' | "wet, don't ride" | 'closed' | 'update needed';
  lastUpdated: string;
}
