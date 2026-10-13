export interface User { name: string; email: string; role: string; }

export interface Report {
  id: string; citizen: string; type: string; typeEs: string; aiClass: string;
  confidence: string; location: [number, number]; reportedAt: string;
  recommendedAction: string; agency: string; status: string; statusEs: string;
  image: null; description: string;
}

export interface Collection {
  id: string; reportId: string; citizen: string; type: string;
  location: [number, number]; createdAt: string; agency: string;
  vehicle: string; driver: string; status: string; scheduleDate: string; eta: number;
}

export interface EcoPoint {
  id: string; name: string; address: string; lat: number; lng: number;
  waste: string[]; hours: string; capacity: number; occupancy: number;
  agency: string; status: string;
}

export interface Citizen {
  id: string; name: string; phone: string; email: string; reports: number;
  collections: number; points: number; rewards: number; lastActivity: string; status: string;
}

export interface Agency {
  id: string; name: string; type: string; contact: string; requests: number;
  pending: number; completed: number; vehicles: number; responseTime: number; status: string;
}

export interface Vehicle {
  id: string; plate: string; agency: string; driver: string; type: string;
  capacity: number; location: [number, number]; load: number; status: string;
}

export interface Reward {
  id: string; citizen: string; pointsEarned: number; pointsRedeemed: number;
  balance: number; pendingRedemptions: number; approvedRedemptions: number;
  rejectedRedemptions: number; lastRedemption: string;
}

export interface NewsItem {
  id: number; title: string; titleEn: string; excerpt: string; excerptEn: string;
  image: null | string; date: string; published: boolean; scheduled: string | null;
}

export interface LogEntry { id: number; timestamp: string; type: string; msg: string; }

export interface Notification { type: 'alert' | 'info' | 'success'; title: string; body: string; ts: string; }

export interface Stats {
  reports: number; pending: number; scheduled: number; active: number;
  completed: number; citizens: number; ecopoints: number; rewards: number;
}

export interface Toast { id: number; type: 'success' | 'alert' | 'info'; title: string; body: string; }

export type Lang = 'es' | 'en';
export type Page = 'dashboard' | 'reports' | 'collections' | 'tracking' | 'ecopoints' |
  'citizens' | 'agencies' | 'fleet' | 'rewards' | 'analytics' | 'ai' | 'marketplace' | 'subscription' | 'settings';

export interface DrawerState {
  open: boolean;
  type: 'report' | 'collection' | null;
  data: Report | Collection | null;
  tab?: string;
}

export interface AppState {
  user: User | null;
  page: Page;
  lang: Lang;
  sidebarOpen: boolean;
  mobileSidebar: boolean;
  connection: 'live' | 'reconnecting';
  stats: Stats;
  reports: Report[];
  collections: Collection[];
  ecopoints: EcoPoint[];
  citizens: Citizen[];
  agencies: Agency[];
  vehicles: Vehicle[];
  rewards: Reward[];
  news: NewsItem[];
  logs: LogEntry[];
  notifications: Notification[];
  chartRange: '7' | '30' | '90';
  kanbanMode: boolean;
  drawer: DrawerState;
  toasts: Toast[];
}
