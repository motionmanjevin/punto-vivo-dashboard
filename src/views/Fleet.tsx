import MapboxMap from '@/components/MapboxMap';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';

interface Props { state: AppState; }

function fleetStatusClass(status: string) {
  if (status === 'Available') return 'green';
  if (['Assigned', 'En Route'].includes(status)) return 'sky';
  if (['Collecting', 'Maintenance'].includes(status)) return 'amber';
  return 'red';
}

export default function Fleet({ state }: Props) {
  const t = useT(state.lang);
  const lang = state.lang;

  function fleetStatusLabel(status: string) {
    const keyMap: Record<string, string> = { Available: 'fleet.available', Assigned: 'fleet.assigned', 'En Route': 'fleet.enroute', Collecting: 'fleet.collecting', Maintenance: 'fleet.maintenance', Offline: 'fleet.offline' };
    return t(keyMap[status] ?? status);
  }

  return (
    <div className="rise">
      <div className="grid g2" style={{ marginBottom: 20 }}>
        {state.vehicles.map(v => (
          <div className="card" key={v.id}>
            <div className="card-h">
              <h3>{v.id}</h3>
              <span className={`pill ${fleetStatusClass(v.status)}`}><span className="pd" />{fleetStatusLabel(v.status)}</span>
            </div>
            <div className="card-b">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12 }}>
                <div><div className="label">{t('fleet.plate')}</div><div className="mono" style={{ fontWeight: 600 }}>{v.plate}</div></div>
                <div><div className="label">{t('fleet.type')}</div><div style={{ fontWeight: 600 }}>{v.type}</div></div>
                <div><div className="label">{t('fleet.driver')}</div><div style={{ fontSize: 11 }}>{v.driver}</div></div>
                <div><div className="label">{t('fleet.agency')}</div><div style={{ fontSize: 11 }}>{v.agency}</div></div>
                <div><div className="label">{t('fleet.capacity')}</div><div className="mono">{v.capacity} {t('fleet.tons')}</div></div>
                <div><div className="label">{t('fleet.load')}</div><div className="mono" style={{ fontWeight: 700, color: v.load > v.capacity * 0.8 ? 'var(--red)' : 'var(--green)' }}>{v.load} {t('fleet.tons')}</div></div>
                <div style={{ gridColumn: '1 / -1' }}><div className="label">{t('fleet.location')}</div><div className="mono" style={{ fontSize: 10.5 }}>{v.location[0].toFixed(5)}, {v.location[1].toFixed(5)}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-h"><h3>{t('dashboard.map_title')} — {t('fleet.title')}</h3></div>
        <div className="card-b" style={{ padding: 0 }}>
          <MapboxMap id="fleetMap" vehicles={state.vehicles} />
        </div>
      </div>
    </div>
  );
}
