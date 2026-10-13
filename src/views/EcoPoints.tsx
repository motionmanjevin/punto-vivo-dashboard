import { MapPin } from 'lucide-react';
import MapboxMap from '@/components/MapboxMap';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';

interface Props { state: AppState; }

function epStatusClass(status: string) {
  if (status === 'Open') return 'green';
  if (status === 'Busy' || status === 'Near Capacity') return 'amber';
  return 'red';
}

export default function EcoPoints({ state }: Props) {
  const t = useT(state.lang);
  const lang = state.lang;

  function epStatusLabel(status: string) {
    const keyMap: Record<string, string> = { Open: 'ecopoints.open', Busy: 'ecopoints.busy', 'Near Capacity': 'ecopoints.near', Full: 'ecopoints.full', Closed: 'ecopoints.closed' };
    return t(keyMap[status] ?? status);
  }

  return (
    <div className="rise">
      <div className="grid g3" style={{ marginBottom: 20 }}>
        {state.ecopoints.map(ep => {
          const pct = Math.round((ep.occupancy / ep.capacity) * 100);
          return (
            <div className="card" key={ep.id}>
              <div className="card-h">
                <h3>{ep.name}</h3>
                <span className={`pill ${epStatusClass(ep.status)}`}><span className="pd" />{epStatusLabel(ep.status)}</span>
              </div>
              <div className="card-b">
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={11} /> {ep.address}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                    <span>{t('ecopoints.occupancy')}</span>
                    <span className="mono" style={{ fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: '#0d1728', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 90 ? 'var(--red)' : pct > 70 ? 'var(--amber)' : 'var(--green)', borderRadius: 99, transition: 'width .6s' }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 4 }}>{ep.occupancy} / {ep.capacity} {t('ecopoints.units')}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}><b>{t('ecopoints.hours')}:</b> {ep.hours}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}><b>{t('ecopoints.agency')}:</b> {ep.agency}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}><b>{t('ecopoints.waste')}:</b> {ep.waste.join(', ')}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <div className="card-h"><h3>{t('dashboard.map_title')} — {t('ecopoints.title')}</h3></div>
        <div className="card-b" style={{ padding: 0 }}>
          <MapboxMap id="ecopointMap" ecopoints={state.ecopoints} />
        </div>
      </div>
    </div>
  );
}
