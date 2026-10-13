import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, DollarSign, Star, AlertTriangle, CheckCircle,
  Clock, Search, Users, Truck, Recycle, Building2,
  TrendingUp, ArrowUpRight, Eye, Ban, Shuffle,
} from 'lucide-react';
import type { AppState } from '@/lib/types';

interface Props { state: AppState; }

// ── Mock data ─────────────────────────────────────────────────────────────────

const LISTINGS = [
  { id: 'MKT-001', citizen: 'Ana María López',      type: 'Muebles',          items: 'Sofá 3 puestos + mesa de comedor', zone: 'Suba',       status: 'open',     bids: 4, posted: '2026-09-04 08:12', reward: 1200, weight: '~80 kg', img: '🛋️' },
  { id: 'MKT-002', citizen: 'Miguel Ángel Torres',  type: 'Electrodomésticos', items: 'Nevera + lavadora sin funcionar',  zone: 'Kennedy',    status: 'matched',  bids: 2, posted: '2026-09-04 09:45', reward: 1800, weight: '~90 kg', img: '🧊' },
  { id: 'MKT-003', citizen: 'Carmen Rosa Vargas',   type: 'Electrónicos',     items: '2 monitores + CPU desactualizado', zone: 'Chapinero',  status: 'collected', bids: 6, posted: '2026-09-03 14:20', reward: 950,  weight: '~25 kg', img: '🖥️' },
  { id: 'MKT-004', citizen: 'Diego Fernando Castro', type: 'Construcción',    items: 'Escombros balcón + puertas viejas', zone: 'Bosa',       status: 'open',     bids: 1, posted: '2026-09-04 11:00', reward: 2200, weight: '~200 kg', img: '🏗️' },
  { id: 'MKT-005', citizen: 'Laura Cristina Díaz',  type: 'Muebles',          items: 'Colchón doble + camarote',          zone: 'Engativá',   status: 'disputed', bids: 3, posted: '2026-09-02 16:30', reward: 800,  weight: '~45 kg', img: '🛏️' },
  { id: 'MKT-006', citizen: 'Pedro José Sánchez',   type: 'Jardín',           items: 'Podas + tierra + bolsas orgánicas', zone: 'Usaquén',    status: 'open',     bids: 2, posted: '2026-09-04 07:55', reward: 500,  weight: '~60 kg', img: '🌿' },
  { id: 'MKT-007', citizen: 'Valentina Herrera',    type: 'Hogar',            items: 'Cajas ropa usada + plásticos varios', zone: 'Fontibón', status: 'matched',  bids: 5, posted: '2026-09-03 19:10', reward: 600,  weight: '~20 kg', img: '📦' },
  { id: 'MKT-008', citizen: 'Mateo Rodríguez',      type: 'Madera',           items: 'Paletas de madera + residuos obra',  zone: 'Suba',      status: 'open',     bids: 0, posted: '2026-09-04 12:45', reward: 1100, weight: '~70 kg', img: '🪵' },
];

const BIDS = [
  { id: 'BID-441', listing: 'MKT-001', collector: 'Jhon Morales',   collectorId: 'COLL-1001', type: 'informal', vehicle: 'Motorcycle + trailer', eta: '18 min', rating: '4.8', offered: '2026-09-04 08:45', status: 'pending' },
  { id: 'BID-442', listing: 'MKT-001', collector: 'UAESP',          collectorId: 'AGN-001',   type: 'agency',   vehicle: 'Camión PV-003',        eta: '35 min', rating: '4.6', offered: '2026-09-04 09:00', status: 'pending' },
  { id: 'BID-443', listing: 'MKT-002', collector: 'María Ospina',   collectorId: 'COLL-1002', type: 'informal', vehicle: 'Pickup truck',          eta: '22 min', rating: '4.9', offered: '2026-09-04 10:15', status: 'accepted' },
  { id: 'BID-444', listing: 'MKT-004', collector: 'Recicladores Org.', collectorId: 'AGN-007', type: 'agency',  vehicle: 'Volqueta PV-007',       eta: '55 min', rating: '4.4', offered: '2026-09-04 11:30', status: 'pending' },
  { id: 'BID-445', listing: 'MKT-007', collector: 'Carlos Suárez',  collectorId: 'COLL-1003', type: 'informal', vehicle: 'Cargo bicycle',          eta: '12 min', rating: '4.7', offered: '2026-09-03 19:40', status: 'accepted' },
];

const TRANSACTIONS = [
  { id: 'TXN-2201', listing: 'MKT-003', citizen: 'Carmen Rosa Vargas', collector: 'Ana Torres', type: 'informal', reward: 950,  commission: 95,  status: 'completed', date: '2026-09-03 18:00', rating: 5 },
  { id: 'TXN-2198', listing: 'MKT-010', citizen: 'Santiago Gómez',      collector: 'UAESP',      type: 'agency',   reward: 1400, commission: 140, status: 'completed', date: '2026-09-03 14:30', rating: 4 },
  { id: 'TXN-2194', listing: 'MKT-008', citizen: 'Isabella Martínez',   collector: 'Luis Gómez', type: 'informal', reward: 700,  commission: 70,  status: 'completed', date: '2026-09-02 11:15', rating: 5 },
  { id: 'TXN-2187', listing: 'MKT-014', citizen: 'Pedro José Sánchez',  collector: 'Limpieza Bogotá SAS', type: 'agency', reward: 3200, commission: 320, status: 'completed', date: '2026-09-01 09:00', rating: 4 },
  { id: 'TXN-2180', listing: 'MKT-021', citizen: 'Ana María López',     collector: 'Diego Castro', type: 'informal', reward: 580, commission: 58,  status: 'completed', date: '2026-08-31 16:45', rating: 3 },
];

const DISPUTES = [
  { id: 'DSP-091', listing: 'MKT-005', citizen: 'Laura Cristina Díaz', collector: 'Sandra Peña', reason: 'El colector no recogió todos los ítems reportados en el listado', status: 'open',   priority: 'high',   opened: '2026-09-04 13:20' },
  { id: 'DSP-088', listing: 'MKT-019', citizen: 'Mateo Rodríguez',     collector: 'UAESP',       reason: 'Residuos dejados en vía pública después de recolección parcial', status: 'review', priority: 'medium', opened: '2026-09-03 10:00' },
  { id: 'DSP-085', listing: 'MKT-031', citizen: 'Valentina Herrera',   collector: 'Luis Gómez',  reason: 'No llegó en el horario confirmado (3h de retraso)',               status: 'resolved', priority: 'low',  opened: '2026-09-01 08:30' },
];

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; color: string; pill: string }> = {
  open:      { label: 'Disponible',  color: '#10b981', pill: 'green'  },
  matched:   { label: 'Asignado',    color: '#6366f1', pill: 'sky'    },
  collected: { label: 'Recolectado', color: '#10b981', pill: 'green'  },
  disputed:  { label: 'Disputado',   color: '#ef4444', pill: 'red'    },
  completed: { label: 'Completado',  color: '#10b981', pill: 'green'  },
  pending:   { label: 'Pendiente',   color: '#f59e0b', pill: 'amber'  },
  accepted:  { label: 'Aceptado',    color: '#10b981', pill: 'green'  },
  review:    { label: 'En revisión', color: '#6366f1', pill: 'sky'    },
  resolved:  { label: 'Resuelto',    color: '#10b981', pill: 'green'  },
  high:      { label: 'Alta',        color: '#ef4444', pill: 'red'    },
  medium:    { label: 'Media',       color: '#f59e0b', pill: 'amber'  },
  low:       { label: 'Baja',        color: '#10b981', pill: 'green'  },
};

function StatusPill({ s }: { s: string }) {
  const m = STATUS_META[s] ?? { label: s, color: 'var(--muted)', pill: '' };
  return <span className={`pill ${m.pill}`}><span className="pd" />{m.label}</span>;
}

// ── Tab types ─────────────────────────────────────────────────────────────────

type Tab = 'listings' | 'bids' | 'transactions' | 'disputes';

// ── Main component ─────────────────────────────────────────────────────────────

export default function Marketplace({ state }: Props) {
  const lang = state.lang;
  const [tab, setTab] = useState<Tab>('listings');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const totalGMV = TRANSACTIONS.reduce((a, t) => a + t.reward, 0);
  const totalCommission = TRANSACTIONS.reduce((a, t) => a + t.commission, 0);

  const TABS: { key: Tab; label: string; count: number; icon: React.ElementType }[] = [
    { key: 'listings',     label: lang === 'es' ? 'Listados activos' : 'Active Listings',    count: LISTINGS.filter(l => l.status === 'open' || l.status === 'matched').length, icon: Package },
    { key: 'bids',         label: lang === 'es' ? 'Ofertas / Pujas'  : 'Bids / Offers',       count: BIDS.filter(b => b.status === 'pending').length, icon: Shuffle },
    { key: 'transactions', label: lang === 'es' ? 'Transacciones'    : 'Transactions',        count: TRANSACTIONS.length, icon: DollarSign },
    { key: 'disputes',     label: lang === 'es' ? 'Disputas'         : 'Disputes',            count: DISPUTES.filter(d => d.status !== 'resolved').length, icon: AlertTriangle },
  ];

  const filteredListings = LISTINGS.filter(l =>
    (!search || [l.id, l.citizen, l.type, l.items, l.zone].join(' ').toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || l.type === typeFilter)
  );

  return (
    <div className="rise">

      {/* KPI tiles */}
      <div className="grid g4" style={{ marginBottom: 20 }}>
        {[
          { label: lang === 'es' ? 'Listados activos' : 'Active Listings', value: LISTINGS.filter(l => l.status === 'open').length, icon: Package, color: '#6366f1', sub: `${LISTINGS.filter(l => l.status === 'matched').length} asignados` },
          { label: lang === 'es' ? 'Colectores activos' : 'Active Collectors', value: 128, icon: Users, color: '#10b981', sub: '94 informales · 34 agencias' },
          { label: 'GMV del mes', value: `$ ${(totalGMV * 24).toLocaleString()}`, icon: DollarSign, color: '#f59e0b', sub: `+12.4% vs mes anterior`, mono: true },
          { label: lang === 'es' ? 'Comisión plataforma' : 'Platform Commission', value: `$ ${(totalCommission * 24).toLocaleString()}`, icon: TrendingUp, color: '#ef4444', sub: '10% sobre transacciones', mono: true },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={i} className="stat rise" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="lb"><span className="ic" style={{ background: k.color + '22', color: k.color }}><Icon size={14} /></span>{k.label}</div>
              <div className={`vl big${k.mono ? ' mono' : ''}`} style={{ color: k.color }}>{k.value}</div>
              <div className="sb2" style={{ fontSize: 10.5, color: 'var(--dim)' }}><ArrowUpRight size={9} style={{ display: 'inline', marginRight: 3 }} />{k.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Main card with tabs */}
      <div className="card">
        {/* Tab bar + search */}
        <div className="card-h" style={{ flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          <div style={{ display: 'flex', gap: 0, flex: 1, minWidth: 0 }}>
            {TABS.map(tb => {
              const Icon = tb.icon;
              const hasAlert = tb.key === 'disputes' && tb.count > 0;
              return (
                <button key={tb.key} onClick={() => setTab(tb.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', fontSize: 12, fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', color: tab === tb.key ? 'var(--sky)' : 'var(--muted)', borderBottom: tab === tb.key ? '2px solid var(--sky)' : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap', transition: 'color .15s' }}>
                  <Icon size={12} />
                  {tb.label}
                  {tb.count > 0 && (
                    <span style={{ fontSize: 9.5, fontWeight: 700, background: hasAlert ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)', color: hasAlert ? '#ef4444' : '#6366f1', padding: '1px 6px', borderRadius: 999 }}>
                      {tb.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 10 }}>
            <div className="search-box">
              <span className="si"><Search size={13} /></span>
              <input className="input" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 160 }} />
            </div>
            {tab === 'listings' && (
              <select className="select" style={{ width: 130 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="">Tipo</option>
                {['Muebles','Electrodomésticos','Electrónicos','Construcción','Jardín','Hogar','Madera'].map(tp => <option key={tp}>{tp}</option>)}
              </select>
            )}
          </div>
        </div>

        <div className="card-b" style={{ padding: 0 }}>

          {/* ── LISTINGS TAB ── */}
          {tab === 'listings' && (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>
                  <th>ID</th><th>Ciudadano</th><th>Ítems</th><th>Zona</th>
                  <th>Tipo</th><th>Peso est.</th><th>Recompensa</th><th>Pujas</th>
                  <th>Estado</th><th>Publicado</th><th>Acciones</th>
                </tr></thead>
                <tbody>
                  {filteredListings.map(l => (
                    <tr key={l.id}>
                      <td className="mono" style={{ color: 'var(--sky)' }}>{l.id}</td>
                      <td><b>{l.citizen}</b></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 15 }}>{l.img}</span>
                          <span style={{ fontSize: 11.5 }}>{l.items}</span>
                        </div>
                      </td>
                      <td><span style={{ fontSize: 11, background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>{l.zone}</span></td>
                      <td style={{ fontSize: 11.5 }}>{l.type}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{l.weight}</td>
                      <td className="mono" style={{ color: '#10b981', fontWeight: 700 }}>{l.reward.toLocaleString()} pts</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', background: l.bids > 3 ? 'rgba(16,185,129,0.15)' : l.bids > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: l.bids > 3 ? '#10b981' : l.bids > 0 ? '#f59e0b' : '#ef4444' }}>
                            {l.bids}
                          </div>
                          <span style={{ fontSize: 10, color: 'var(--dim)' }}>pujas</span>
                        </div>
                      </td>
                      <td><StatusPill s={l.status} /></td>
                      <td className="mono" style={{ fontSize: 10 }}>{l.posted.slice(11)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn sm" title="Ver detalle"><Eye size={11} /></button>
                          <button className="btn sm" title="Asignar colector" style={{ color: 'var(--sky)' }}><Truck size={11} /></button>
                          {l.status === 'open' && <button className="btn sm" title="Cancelar listado" style={{ color: '#ef4444' }}><Ban size={11} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── BIDS TAB ── */}
          {tab === 'bids' && (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>
                  <th>ID Oferta</th><th>Listado</th><th>Colector</th><th>Tipo</th>
                  <th>Vehículo</th><th>ETA</th><th>Calificación</th><th>Ofertado</th><th>Estado</th><th>Acciones</th>
                </tr></thead>
                <tbody>
                  {BIDS.map(b => (
                    <tr key={b.id}>
                      <td className="mono" style={{ color: 'var(--sky)' }}>{b.id}</td>
                      <td className="mono" style={{ color: '#f59e0b' }}>{b.listing}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: b.type === 'agency' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {b.type === 'agency' ? <Building2 size={11} color="#6366f1" /> : <Recycle size={11} color="#f59e0b" />}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{b.collector}</div>
                            <div className="mono" style={{ fontSize: 10, color: 'var(--dim)' }}>{b.collectorId}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: b.type === 'agency' ? 'rgba(99,102,241,0.12)' : 'rgba(245,158,11,0.12)', color: b.type === 'agency' ? '#6366f1' : '#f59e0b' }}>
                          {b.type === 'agency' ? 'Agencia' : 'Informal'}
                        </span>
                      </td>
                      <td style={{ fontSize: 11.5 }}>{b.vehicle}</td>
                      <td className="mono" style={{ color: 'var(--sky)' }}>{b.eta}</td>
                      <td style={{ color: '#f59e0b', fontWeight: 700 }}>★ {b.rating}</td>
                      <td className="mono" style={{ fontSize: 10 }}>{b.offered.slice(11)}</td>
                      <td><StatusPill s={b.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {b.status === 'pending' && <>
                            <button className="btn sm primary" style={{ fontSize: 10 }}><CheckCircle size={10} /></button>
                            <button className="btn sm" style={{ color: '#ef4444', fontSize: 10 }}><Ban size={10} /></button>
                          </>}
                          {b.status === 'accepted' && <span style={{ fontSize: 10, color: '#10b981' }}>✓ Asignado</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── TRANSACTIONS TAB ── */}
          {tab === 'transactions' && (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>
                  <th>ID</th><th>Listado</th><th>Ciudadano</th><th>Colector</th>
                  <th>Tipo</th><th>Recompensa</th><th>Comisión (10%)</th><th>Calificación</th><th>Fecha</th><th>Estado</th>
                </tr></thead>
                <tbody>
                  {TRANSACTIONS.map(txn => (
                    <tr key={txn.id}>
                      <td className="mono" style={{ color: 'var(--sky)' }}>{txn.id}</td>
                      <td className="mono" style={{ color: '#f59e0b' }}>{txn.listing}</td>
                      <td style={{ fontSize: 12 }}>{txn.citizen}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {txn.type === 'agency'
                            ? <Building2 size={11} color="#6366f1" />
                            : <Recycle size={11} color="#f59e0b" />}
                          <span style={{ fontSize: 12 }}>{txn.collector}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 999, background: txn.type === 'agency' ? 'rgba(99,102,241,0.12)' : 'rgba(245,158,11,0.12)', color: txn.type === 'agency' ? '#6366f1' : '#f59e0b', fontWeight: 700 }}>
                          {txn.type === 'agency' ? 'Agencia' : 'Informal'}
                        </span>
                      </td>
                      <td className="mono" style={{ color: '#10b981', fontWeight: 700 }}>{txn.reward.toLocaleString()} pts</td>
                      <td className="mono" style={{ color: '#f59e0b' }}>{txn.commission.toLocaleString()} pts</td>
                      <td>
                        <span style={{ color: '#f59e0b' }}>{'★'.repeat(txn.rating)}{'☆'.repeat(5 - txn.rating)}</span>
                      </td>
                      <td className="mono" style={{ fontSize: 10 }}>{txn.date.slice(0, 10)}</td>
                      <td><StatusPill s={txn.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── DISPUTES TAB ── */}
          {tab === 'disputes' && (
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DISPUTES.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ background: 'var(--bg)', borderRadius: 12, border: `1px solid ${d.status === 'open' ? 'rgba(239,68,68,0.3)' : d.status === 'review' ? 'rgba(99,102,241,0.25)' : 'var(--border)'}`, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: d.status === 'open' ? 'rgba(239,68,68,0.12)' : d.status === 'review' ? 'rgba(99,102,241,0.12)' : 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AlertTriangle size={15} color={d.status === 'open' ? '#ef4444' : d.status === 'review' ? '#6366f1' : '#10b981'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--sky)' }}>{d.id}</span>
                        <span className="mono" style={{ fontSize: 11, color: '#f59e0b' }}>{d.listing}</span>
                        <StatusPill s={d.status} />
                        <StatusPill s={d.priority} />
                        <span style={{ fontSize: 10, color: 'var(--dim)', marginLeft: 'auto' }}><Clock size={9} style={{ display: 'inline', marginRight: 3 }} />{d.opened.slice(0, 10)}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--text)', marginBottom: 8, lineHeight: 1.5 }}>"{d.reason}"</div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap' }}>
                        <span><Users size={10} style={{ display: 'inline', marginRight: 4 }} />Ciudadano: <b style={{ color: 'var(--text)' }}>{d.citizen}</b></span>
                        <span><Recycle size={10} style={{ display: 'inline', marginRight: 4 }} />Colector: <b style={{ color: 'var(--text)' }}>{d.collector}</b></span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {d.status !== 'resolved' && <>
                        <button className="btn sm primary" style={{ fontSize: 11 }}><CheckCircle size={11} /> Resolver</button>
                        <button className="btn sm" style={{ fontSize: 11 }}><Eye size={11} /> Revisar</button>
                      </>}
                      {d.status === 'resolved' && <span style={{ fontSize: 11, color: '#10b981', padding: '4px 8px' }}>✓ Resuelto</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid g3" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-h"><h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Recycle size={13} color="#f59e0b" /> Top Colectores Informales</h3></div>
          <div className="card-b" style={{ padding: '0 16px' }}>
            {[
              { name: 'Ana Torres', zone: 'Engativá', jobs: 47, rating: '4.9' },
              { name: 'María Ospina', zone: 'Kennedy', jobs: 41, rating: '4.8' },
              { name: 'Diego Castro', zone: 'Suba', jobs: 38, rating: '4.7' },
              { name: 'Jhon Morales', zone: 'Bosa', jobs: 35, rating: '4.6' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 3 ? '1px solid var(--border)' : undefined }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#f59e0b', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--dim)' }}>{c.zone} · {c.jobs} trabajos</div>
                </div>
                <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>★ {c.rating}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Package size={13} color="#6366f1" /> Tipos de residuos más listados</h3></div>
          <div className="card-b">
            {[
              { type: 'Muebles', count: 38, pct: 74 },
              { type: 'Electrodomésticos', count: 22, pct: 43 },
              { type: 'Electrónicos', count: 18, pct: 35 },
              { type: 'Construcción', count: 14, pct: 27 },
              { type: 'Jardín', count: 11, pct: 21 },
            ].map((r, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                  <span>{r.type}</span><span className="mono" style={{ color: '#6366f1' }}>{r.count}</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 99 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ duration: 0.6, delay: i * 0.08 }}
                    style={{ height: '100%', background: '#6366f1', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Star size={13} color="#10b981" /> Zonas más activas</h3></div>
          <div className="card-b">
            {[
              { zone: 'Suba',      listings: 18, collectors: 24 },
              { zone: 'Kennedy',   listings: 14, collectors: 19 },
              { zone: 'Engativá',  listings: 12, collectors: 16 },
              { zone: 'Bosa',      listings: 10, collectors: 14 },
              { zone: 'Chapinero', listings: 8,  collectors: 11 },
            ].map((z, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : undefined }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{z.zone}</div>
                  <div style={{ fontSize: 10, color: 'var(--dim)' }}>{z.collectors} colectores disponibles</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{z.listings}</div>
                  <div style={{ fontSize: 9.5, color: 'var(--dim)' }}>listados</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
