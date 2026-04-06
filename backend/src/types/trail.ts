export interface Trail {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'open' | "wet, don't ride" | 'closed' | 'update needed';
  lastUpdated: string;
}
