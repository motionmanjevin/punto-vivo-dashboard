import MapboxMap from '@/components/MapboxMap';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';

interface Props { state: AppState; }

export default function Tracking({ state }: Props) {
  const t = useT(state.lang);
  const activeCollections = state.collections.filter(c => ['En Route', 'Collector Assigned', 'Arrived', 'Collecting'].includes(c.status)).slice(0, 6);

  return (
    <div className="rise">
      <div className="grid g2" style={{ marginBottom: 20 }}>
        {activeCollections.map(c => (
          <div className="card" key={c.id}>
            <div className="card-h">
              <h3>{t('tracking.vehicle')}: {c.vehicle}</h3>
              <span className={`pill sky`}><span className="pd" />{c.status}</span>
            </div>
            <div className="card-b">
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                <div><div className="label">{t('tracking.driver')}</div><div style={{ fontWeight: 600 }}>{c.driver}</div></div>
                <div><div className="label">{t('tracking.distance')}</div><div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--sky)' }}>{(Math.random() * 5 + 0.5).toFixed(1)} km</div></div>
                <div><div className="label">{t('tracking.eta')}</div><div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>{c.eta} min</div></div>
                <div><div className="label">{t('tracking.request')}</div><div className="mono">{c.id}</div></div>
              </div>
              <div className="label">{t('reports.citizen')}</div>
              <div style={{ marginBottom: 8 }}>{c.citizen}</div>
              <div className="label">{t('reports.location')}</div>
              <div className="mono" style={{ fontSize: 11 }}>{c.location[0].toFixed(5)}, {c.location[1].toFixed(5)}</div>
            </div>
          </div>
        ))}
        {activeCollections.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty"><div className="eic"><span>🚛</span></div><b>{t('tracking.no_active')}</b></div>
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-h"><h3>{t('dashboard.map_title')} — {t('tracking.title')}</h3></div>
        <div className="card-b" style={{ padding: 0 }}>
          <MapboxMap id="trackingMap" center={[4.6981, -74.0420]} zoom={12} reports={state.reports} vehicles={state.vehicles} className="map-container full" />
        </div>
      </div>
    </div>
  );
}
