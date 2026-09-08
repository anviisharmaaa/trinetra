import type { Camera } from '../../types';
import { ALL_BUNDLES } from '../caseBundles';

export const mockCameras: Camera[] = [
  { id: 'CAM-BW02', name: 'Bandra West — Junction 2', code: 'BW-02', locationId: 'loc-001', status: 'online', coordinates: { lat: 19.0598, lng: 72.8298 }, coverage: 'Hill Road Junction' },
  { id: 'CAM-BW12', name: 'Bandra West — Sea Breeze Apts', code: 'BW-12', locationId: 'loc-001', status: 'online', coordinates: { lat: 19.0596, lng: 72.8295 }, coverage: 'Residential Gate' },
  { id: 'CAM-AW09', name: 'Andheri East — Metro Exit', code: 'AW-09', locationId: 'loc-002', status: 'online', coordinates: { lat: 19.1138, lng: 72.87 }, coverage: 'Metro Station Exit 3' },
  { id: 'CAM-LW07', name: 'Lower Parel — Tower Lobby', code: 'LW-07', locationId: 'loc-003', status: 'online', coordinates: { lat: 18.9984, lng: 72.8305 }, coverage: 'Commercial Lobby' },
  { id: 'CAM-OE11', name: 'Colaba — Dockside East', code: 'OE-11', locationId: 'loc-004', status: 'online', coordinates: { lat: 18.9069, lng: 72.815 }, coverage: 'Dock Perimeter' },
  { id: 'CAM-MW05', name: 'Malad West — Market Road', code: 'MW-05', locationId: 'loc-005', status: 'offline', coordinates: { lat: 19.1877, lng: 72.8491 }, coverage: 'Market Approach' },
  { id: 'CAM-CH03', name: 'Chembur — Industrial Gate 3', code: 'CH-03', locationId: 'loc-006', status: 'online', coordinates: { lat: 19.0524, lng: 72.9007 }, coverage: 'Warehouse Gate' },
  { id: 'CAM-PW08', name: 'Powai — Residency Entrance', code: 'PW-08', locationId: 'loc-007', status: 'online', coordinates: { lat: 19.1178, lng: 72.9062 }, coverage: 'Residency Entrance' },
  { id: 'CAM-DR02', name: 'Dockyard Road — Cargo Bay 2', code: 'DR-02', locationId: 'loc-008', status: 'online', coordinates: { lat: 18.9649, lng: 72.8427 }, coverage: 'Cargo Bay' },
  { id: 'CAM-KR06', name: 'Kurla — Transit Hub North', code: 'KR-06', locationId: 'loc-009', status: 'online', coordinates: { lat: 19.073, lng: 72.8828 }, coverage: 'Transit Hub' },
  ...ALL_BUNDLES.flatMap((b) => b.cameras),
];
