import type { Report, Collection, EcoPoint, Citizen, Agency, Vehicle, Reward, NewsItem, LogEntry } from './types';

export const LOGO_URL = 'https://image.qwenlm.ai/public_source/336adb89-9b16-413d-a580-66cd15437c99/11774eb4d-181a-4fc2-919b-6ee2b4a4bd54.png';

const BOGOTA_COORDS: [number, number][] = [
  [4.7110, -74.0721], [4.6533, -74.0836], [4.6685, -74.1065], [4.6097, -74.0817],
  [4.7517, -74.0584], [4.6981, -74.0420], [4.5964, -74.0757], [4.7866, -74.0458],
  [4.6400, -74.0900], [4.6800, -74.0600], [4.7200, -74.0800], [4.6600, -74.0700],
];
const WASTE_TYPES = ['Furniture', 'Mattresses', 'Appliances', 'Electronics', 'Wood', 'Construction', 'Garden', 'Household', 'Other'];
const WASTE_TYPES_ES = ['Muebles', 'Colchones', 'Electrodomésticos', 'Electrónicos', 'Madera', 'Construcción', 'Jardín', 'Hogar', 'Otros'];
const STATUSES = ['Submitted', 'AI Processing', 'EcoPoint Recommended', 'Awaiting Citizen', 'Collection Requested', 'Agency Review', 'Scheduled', 'Collector En Route', 'Collected', 'Completed', 'Cancelled'];
const STATUSES_ES = ['Enviado', 'Procesando IA', 'Ecopunto Recomendado', 'Esperando Ciudadano', 'Recolección Solicitada', 'Revisión Agencia', 'Programada', 'Colector En Camino', 'Recolectado', 'Completado', 'Cancelado'];
export const AGENCIES = ['UAESP', 'Secretaría de Ambiente', 'Alcaldía Local Chapinero', 'Alcaldía Local Usaquén', 'Alcaldía Local Suba', 'Alcaldía Local Kennedy', 'Recicladores Organizados', 'Limpieza Bogotá SAS'];
const DRIVERS = ['Carlos Andrés Rodríguez', 'María Fernanda Gómez', 'Juan Sebastián Martínez', 'Valentina Torres', 'Andrés Felipe Cárdenas', 'Camila Rodríguez', 'Luis Miguel Herrera', 'Sofía Ramírez'];
const VEHICLES = ['PV-001', 'PV-002', 'PV-003', 'PV-004', 'PV-005', 'PV-006', 'PV-007', 'PV-008', 'PV-009', 'PV-010'];
export const CITIZEN_NAMES = ['Ana María López', 'Pedro José Sánchez', 'Laura Cristina Díaz', 'Miguel Ángel Torres', 'Carmen Rosa Vargas', 'Diego Fernando Castro', 'Isabella Martínez', 'Santiago Gómez', 'Valentina Herrera', 'Mateo Rodríguez'];

export const rnd = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1));
export const pick = <T>(arr: T[]): T => arr[rnd(0, arr.length - 1)];

export function fmtDate(d: string, lang: string) {
  return new Date(d).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}
export function fmtTime(d: string, lang: string) {
  return new Date(d).toLocaleTimeString(lang === 'es' ? 'es-CO' : 'en-US', { hour: '2-digit', minute: '2-digit' });
}
export function fmtDateTime(d: string, lang: string) {
  return fmtDate(d, lang) + ' ' + fmtTime(d, lang);
}

export function generateReports(n = 50): Report[] {
  const reports: Report[] = [];
  const now = Date.now();
  for (let i = 0; i < n; i++) {
    const typeIdx = rnd(0, WASTE_TYPES.length - 1);
    const statusIdx = rnd(0, STATUSES.length - 1);
    reports.push({
      id: `WR-${String(2000 + i).padStart(4, '0')}`,
      citizen: pick(CITIZEN_NAMES), type: WASTE_TYPES[typeIdx], typeEs: WASTE_TYPES_ES[typeIdx],
      aiClass: pick(WASTE_TYPES), confidence: (0.75 + Math.random() * 0.24).toFixed(2),
      location: pick(BOGOTA_COORDS), reportedAt: new Date(now - rnd(0, 30 * 864e5)).toISOString(),
      recommendedAction: pick(['EcoPoint', 'Collection', 'Self-disposal']),
      agency: pick(AGENCIES), status: STATUSES[statusIdx], statusEs: STATUSES_ES[statusIdx],
      image: null, description: 'Reporte de residuo voluminoso en vía pública',
    });
  }
  return reports.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
}

export function generateCollections(n = 40, reportIds?: string[]): Collection[] {
  const cols: Collection[] = [];
  const now = Date.now();
  for (let i = 0; i < n; i++) {
    const reportId = reportIds && reportIds.length > 0
      ? reportIds[i % reportIds.length]
      : `WR-${rnd(2000, 2049)}`;
    cols.push({
      id: `CR-${1000 + i}`, reportId, citizen: pick(CITIZEN_NAMES),
      type: pick(WASTE_TYPES), location: pick(BOGOTA_COORDS),
      createdAt: new Date(now - rnd(0, 14 * 864e5)).toISOString(), agency: pick(AGENCIES),
      vehicle: pick(VEHICLES), driver: pick(DRIVERS),
      status: pick(['New', 'Awaiting Agency', 'Approved', 'Scheduled', 'Collector Assigned', 'En Route', 'Arrived', 'Collected', 'Completed', 'Cancelled']),
      scheduleDate: new Date(now + rnd(0, 7 * 864e5)).toISOString(), eta: rnd(5, 45),
    });
  }
  return cols.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function generateEcopoints(): EcoPoint[] {
  return [
    { id: 'EP-001', name: 'Ecopunto Chapinero', address: 'Cra 13 #63-45', lat: 4.6533, lng: -74.0836, waste: ['Furniture', 'Mattresses', 'Appliances'], hours: '7:00-17:00', capacity: 500, occupancy: 342, agency: 'UAESP', status: 'Open' },
    { id: 'EP-002', name: 'Ecopunto Usaquén', address: 'Cra 7 #153-20', lat: 4.7517, lng: -74.0584, waste: ['Furniture', 'Electronics', 'Wood'], hours: '8:00-16:00', capacity: 400, occupancy: 380, agency: 'UAESP', status: 'Near Capacity' },
    { id: 'EP-003', name: 'Ecopunto Suba', address: 'Cll 145 #11-25', lat: 4.7866, lng: -74.0458, waste: ['Mattresses', 'Appliances', 'Garden'], hours: '7:00-18:00', capacity: 600, occupancy: 120, agency: 'UAESP', status: 'Open' },
    { id: 'EP-004', name: 'Ecopunto Kennedy', address: 'Av. Américas #68-15', lat: 4.6097, lng: -74.0817, waste: ['Furniture', 'Construction', 'Household'], hours: '6:00-17:00', capacity: 450, occupancy: 445, agency: 'UAESP', status: 'Full' },
    { id: 'EP-005', name: 'Ecopunto Fontibón', address: 'Cll 16 #100-30', lat: 4.6685, lng: -74.1065, waste: ['Electronics', 'Appliances', 'Wood'], hours: '8:00-17:00', capacity: 350, occupancy: 180, agency: 'UAESP', status: 'Open' },
    { id: 'EP-006', name: 'Ecopunto Bosa', address: 'Cll 50 #80-12', lat: 4.5964, lng: -74.0757, waste: ['Furniture', 'Mattresses', 'Garden'], hours: '7:00-16:00', capacity: 400, occupancy: 320, agency: 'UAESP', status: 'Busy' },
  ];
}

export function generateCitizens(): Citizen[] {
  return CITIZEN_NAMES.map((name, i) => ({
    id: `CIT-${String(i + 1).padStart(3, '0')}`, name,
    phone: `+57 3${rnd(10, 99)} ${rnd(100, 999)} ${rnd(1000, 9999)}`,
    email: name.toLowerCase().replace(/ /g, '.') + '@email.com',
    reports: rnd(1, 25), collections: rnd(0, 15), points: rnd(50, 2500),
    rewards: rnd(0, 8), lastActivity: new Date(Date.now() - rnd(0, 30 * 864e5)).toISOString(),
    status: Math.random() > 0.1 ? 'Active' : 'Inactive',
  }));
}

export function generateAgencies(): Agency[] {
  return AGENCIES.map((name, i) => ({
    id: `AG-${String(i + 1).padStart(3, '0')}`, name, type: i < 2 ? 'Municipal' : 'Local',
    contact: `contacto${i + 1}@${name.toLowerCase().replace(/ /g, '')}.gov.co`,
    requests: rnd(10, 80), pending: rnd(2, 15), completed: rnd(50, 500),
    vehicles: rnd(2, 12), responseTime: rnd(15, 120),
    status: Math.random() > 0.15 ? 'Active' : 'Inactive',
  }));
}

export function generateVehicles(): Vehicle[] {
  return VEHICLES.map((id, i) => ({
    id, plate: `${pick(['ABC', 'DEF', 'GHI', 'JKL'])}-${rnd(100, 999)}`,
    agency: pick(AGENCIES), driver: DRIVERS[i % DRIVERS.length],
    type: pick(['Truck', 'Van', 'Pickup']), capacity: rnd(2, 8),
    location: pick(BOGOTA_COORDS), load: rnd(0, 8),
    status: pick(['Available', 'Assigned', 'En Route', 'Collecting', 'Maintenance', 'Offline']),
  }));
}

export function generateRewards(): Reward[] {
  return CITIZEN_NAMES.slice(0, 8).map((citizen, i) => ({
    id: `RW-${1000 + i}`, citizen, pointsEarned: rnd(100, 3000),
    pointsRedeemed: rnd(0, 1500), balance: rnd(50, 2000),
    pendingRedemptions: rnd(0, 3), approvedRedemptions: rnd(1, 10),
    rejectedRedemptions: rnd(0, 2), lastRedemption: pick(['Shopping Voucher', 'Eco Groceries Coupon', 'Cash']),
  }));
}

export function generateNews(): NewsItem[] {
  return [
    { id: 1, title: 'Nuevos Ecopuntos en Bogotá', titleEn: 'New EcoPoints in Bogotá', excerpt: 'Se inauguraron 3 nuevos ecopuntos en las localidades de Suba y Kennedy.', excerptEn: '3 new ecopoints were inaugurated in Suba and Kennedy localities.', image: null, date: new Date(Date.now() - 2 * 864e5).toISOString(), published: true, scheduled: null },
    { id: 2, title: 'Campaña de Reciclaje 2026', titleEn: 'Recycling Campaign 2026', excerpt: 'Únete a la campaña ciudadana de manejo responsable de residuos voluminosos.', excerptEn: 'Join the citizen campaign for responsible bulky waste management.', image: null, date: new Date(Date.now() - 5 * 864e5).toISOString(), published: true, scheduled: null },
    { id: 3, title: 'Actualización de la App Móvil', titleEn: 'Mobile App Update', excerpt: 'Nueva versión con seguimiento en tiempo real de recolecciones.', excerptEn: 'New version with real-time collection tracking.', image: null, date: new Date(Date.now() + 3 * 864e5).toISOString(), published: false, scheduled: new Date(Date.now() + 3 * 864e5).toISOString() },
  ];
}

export function generateLogs(): LogEntry[] {
  const logs: LogEntry[] = [];
  const now = Date.now();
  const types = ['REPORT', 'COLLECTION', 'VEHICLE', 'CITIZEN', 'SYSTEM', 'AGENCY'];
  for (let i = 0; i < 60; i++) {
    const type = pick(types);
    logs.push({
      id: i, timestamp: new Date(now - rnd(0, 48 * 3600e3)).toISOString(), type,
      msg: `${type} ${pick(['created', 'updated', 'approved', 'assigned', 'completed', 'cancelled'])} — ${pick(['WR-1234', 'CR-1042', 'PV-042', 'CIT-001', 'AG-003', 'EP-002'])}`,
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getStatusPill(status: string): string {
  const map: Record<string, string> = {
    Completed: 'green', Collected: 'green', Approved: 'green', Scheduled: 'sky',
    'En Route': 'sky', 'Collector Assigned': 'sky', Arrived: 'amber', Collecting: 'amber',
    New: 'amber', 'Awaiting Agency': 'amber', 'AI Processing': 'violet',
    'EcoPoint Recommended': 'violet', Submitted: 'sky', 'Agency Review': 'amber',
    Cancelled: 'red', 'Collection Requested': 'sky', 'Awaiting Citizen': 'amber',
    'Collector En Route': 'sky',
  };
  return map[status] || 'sky';
}

export function getLogTypeColor(type: string): string {
  const map: Record<string, string> = { REPORT: 't-sky', COLLECTION: 't-green', VEHICLE: 't-amber', CITIZEN: 't-violet', SYSTEM: 't-red', AGENCY: 't-green' };
  return map[type] || 't-sky';
}

export function generateChartData(days: number, lang: string) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { month: 'short', day: '2-digit' }),
      reports: rnd(20, 80), completed: rnd(15, 60), scheduled: rnd(5, 25),
    });
  }
  return data;
}

export function generateCategoryData(lang: string) {
  const types = lang === 'es' ? WASTE_TYPES_ES : WASTE_TYPES;
  const colors = ['#38bdf8', '#22c55e', '#f59e0b', '#a78bfa', '#fb7185', '#06b6d4', '#84cc16', '#f97316', '#64748b'];
  return types.map((name, i) => ({ name, value: rnd(50, 500), color: colors[i] }));
}
