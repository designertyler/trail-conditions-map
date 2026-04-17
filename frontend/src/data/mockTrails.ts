import type { Trail } from '../types/trail';
import type { LatLngExpression } from 'leaflet';

const mockTrails: Trail[] = [
  { id: 'bcgb-west', name: 'BCGB - West', position: [30.2654, -97.8054] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T10:00:00Z' },
  { id: 'bcgb-east', name: 'BCGB - East', position: [30.2639, -97.7700] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T10:00:00Z' },
  { id: 'bluff-creek-ranch', name: 'Bluff Creek Ranch', position: [30.0579, -96.9063] as LatLngExpression, status: 'closed', lastUpdated: '2026-04-14T08:00:00Z' },
  { id: 'bc-peddlers-pass', name: 'Brushy Creek - Peddlers Pass', position: [30.5077, -97.7737] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T09:00:00Z' },
  { id: 'bc-quarter-notch', name: 'Brushy Creek - Quarter Notch', position: [30.5043, -97.7849] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T09:00:00Z' },
  { id: 'bc-dd', name: 'Brushy Creek - Double Down', position: [30.5019, -97.7944] as LatLngExpression, status: "wet, don't ride", lastUpdated: '2026-04-13T14:00:00Z' },
  { id: 'bc-suburban-ninja', name: 'Brushy Creek - Suburban Ninja', position: [30.5343, -97.7800] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T09:00:00Z' },
  { id: 'bc-west', name: 'Brushy Creek - West', position: [30.5100, -97.8100] as LatLngExpression, status: 'needs update', lastUpdated: '2026-04-10T12:00:00Z' },
  { id: 'bull-creek', name: 'Bull Creek', position: [30.3800, -97.8050] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T08:00:00Z' },
  { id: 'cat-mountain', name: 'Cat Mountain', position: [30.3524, -97.7797] as LatLngExpression, status: 'open', lastUpdated: '2026-04-14T16:00:00Z' },
  { id: 'emma-long', name: 'Emma Long', position: [30.3442, -97.8265] as LatLngExpression, status: "wet, don't ride", lastUpdated: '2026-04-13T10:00:00Z' },
  { id: 'flat-creek', name: 'Flat Creek', position: [30.2700, -98.2300] as LatLngExpression, status: 'closed', lastUpdated: '2026-04-12T09:00:00Z' },
  { id: 'flat-rock-ranch', name: 'Flat Rock Ranch', position: [30.0169, -98.8731] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T07:00:00Z' },
  { id: 'lake-georgetown', name: 'Lake Georgetown', position: [30.6699, -97.7387] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T11:00:00Z' },
  { id: 'mt-lakeway', name: 'Lakeway', position: [30.3900, -97.9700] as LatLngExpression, status: 'needs update', lastUpdated: '2026-04-08T15:00:00Z' },
  { id: 'mary-moore-searight', name: 'Mary Moore Searight', position: [30.1598, -97.8087] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T10:00:00Z' },
  { id: 'mckinney-falls', name: 'McKinney Falls', position: [30.1804, -97.7217] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T09:00:00Z' },
  { id: 'muleshoe-bend', name: 'Mule Shoe', position: [30.4870, -98.0987] as LatLngExpression, status: 'open', lastUpdated: '2026-04-14T13:00:00Z' },
  { id: 'pace-bend', name: 'Pace Bend', position: [30.4648, -98.0128] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T08:00:00Z' },
  { id: 'pedernales-falls', name: 'Pedernales Falls', position: [30.3081, -98.2576] as LatLngExpression, status: 'closed', lastUpdated: '2026-04-14T10:00:00Z' },
  { id: 'milton-reimers-ranch', name: 'Reimers Ranch', position: [30.3500, -98.3500] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T07:00:00Z' },
  { id: 'reveille-peak-ranch', name: 'Reveille Peak Ranch', position: [30.7200, -98.4000] as LatLngExpression, status: 'needs update', lastUpdated: '2026-04-09T12:00:00Z' },
  { id: 'rocky-hill-ranch', name: 'Rocky Hill Ranch', position: [30.1200, -97.0500] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T06:00:00Z' },
  { id: 'maxwell-trail', name: 'Maxwell Trail', position: [30.2063, -97.9067] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T10:00:00Z' },
  { id: 'satn-west-mopac', name: 'SATN - west of Mopac', position: [30.2200, -97.8500] as LatLngExpression, status: "wet, don't ride", lastUpdated: '2026-04-13T11:00:00Z' },
  { id: 'satn-east-mopac', name: 'SATN - east of Mopac', position: [30.2233, -97.8332] as LatLngExpression, status: "wet, don't ride", lastUpdated: '2026-04-13T11:00:00Z' },
  { id: 'spider-mountain', name: 'Spider Mountain', position: [30.8349, -98.3384] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T08:00:00Z' },
  { id: 'st-edwards', name: 'St. Edwards', position: [30.4045, -97.7929] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T09:00:00Z' },
  { id: 'thumper', name: 'Thumper', position: [30.4200, -97.7600] as LatLngExpression, status: 'needs update', lastUpdated: '2026-04-11T14:00:00Z' },
  { id: 'walnut-creek', name: 'Walnut Creek', position: [30.3516, -97.6949] as LatLngExpression, status: 'open', lastUpdated: '2026-04-15T10:00:00Z' },
];

export default mockTrails;
