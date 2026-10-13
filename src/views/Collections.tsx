import { Eye, Layout, UserCheck, MapPin, Activity } from 'lucide-react';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';
import { getStatusPill, fmtDateTime, fmtDate } from '@/lib/data';

interface Props {
  state: AppState;
  onViewCollection: (id: string, tab?: string) => void;
  onToggleKanban: () => void;
}

const STATUS_KEYS = ['New', 'Awaiting Agency', 'Approved', 'Scheduled', 'Collector Assigned', 'En Route', 'Arrived', 'Collected', 'Completed', 'Cancelled'];

export default function Collections({ state, onViewCollection, onToggleKanban }: Props) {
  const t = useT(state.lang);
  const lang = state.lang;

  const statusLabels = STATUS_KEYS.map(sk => {
    const keyMap: Record<string, string> = {
      'New': 'collections.new', 'Awaiting Agency': 'collections.awaiting', 'Approved': 'collections.approved',
      'Scheduled': 'collections.scheduled', 'Collector Assigned': 'collections.assigned', 'En Route': 'collections.enroute',
      'Arrived': 'collections.arrived', 'Collected': 'collections.collected', 'Completed': 'collections.completed', 'Cancelled': 'collections.cancelled',
    };
    return t(keyMap[sk] ?? sk);
  });

  return (
    <div className="rise">
      <div className="card">
        <div className="card-h">
          <h3>{t('collections.title')}</h3>
          <span className="sub">{state.collections.length} {t('common.all').toLowerCase()}</span>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn sm primary" onClick={onToggleKanban}>
              <Layout size={12} /> {state.kanbanMode ? t('collections.table') : t('collections.kanban')}
            </button>
          </div>
        </div>
        <div className="card-b" style={{ padding: 0 }}>
          {state.kanbanMode ? (
            <div className="kanban" style={{ padding: 16 }}>
              {STATUS_KEYS.map((sk, i) => {
                const items = state.collections.filter(c => c.status === sk);
                return (
                  <div className="kanban-col" key={sk}>
                    <h4>{statusLabels[i]} <span className="count">{items.length}</span></h4>
                    {items.map(c => (
                      <div className="kanban-card" key={c.id} onClick={() => onViewCollection(c.id)}>
                        <div className="kc-id">{c.id}</div>
                        <div className="kc-title">{c.citizen}</div>
                        <div className="kc-meta"><span>{c.type}</span><span className="mono">{fmtDate(c.createdAt, lang)}</span></div>
                        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                          <button className="btn sm" style={{ fontSize: 9, padding: '2px 7px' }} onClick={e => { e.stopPropagation(); onViewCollection(c.id, 'assign'); }}>
                            <UserCheck size={9} />
                          </button>
                          <button className="btn sm" style={{ fontSize: 9, padding: '2px 7px' }} onClick={e => { e.stopPropagation(); onViewCollection(c.id, 'map'); }}>
                            <MapPin size={9} />
                          </button>
                          <button className="btn sm" style={{ fontSize: 9, padding: '2px 7px' }} onClick={e => { e.stopPropagation(); onViewCollection(c.id, 'monitor'); }}>
                            <Activity size={9} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>
                  <th>{t('reports.id')}</th><th>{t('reports.citizen')}</th><th>{t('reports.type')}</th>
                  <th>{t('reports.agency')}</th><th>{t('tracking.vehicle')}</th><th>{t('tracking.driver')}</th>
                  <th>{t('reports.reported')}</th><th>{t('reports.status')}</th><th>{t('reports.actions')}</th>
                </tr></thead>
                <tbody>
                  {state.collections.map(c => (
                    <tr key={c.id}>
                      <td className="mono" style={{ color: 'var(--sky)' }}>{c.id}</td>
                      <td>{c.citizen}</td><td>{c.type}</td><td>{c.agency}</td>
                      <td className="mono">{c.vehicle}</td><td>{c.driver}</td>
                      <td className="mono">{fmtDateTime(c.createdAt, lang)}</td>
                      <td><span className={`pill ${getStatusPill(c.status)}`}><span className="pd" />{c.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn sm" title="Info" onClick={() => onViewCollection(c.id, 'info')}><Eye size={11} /></button>
                          <button className="btn sm" title="Assign" style={{ color: 'var(--sky)' }} onClick={() => onViewCollection(c.id, 'assign')}><UserCheck size={11} /></button>
                          <button className="btn sm" title="Map" style={{ color: '#10b981' }} onClick={() => onViewCollection(c.id, 'map')}><MapPin size={11} /></button>
                          <button className="btn sm" title="Monitor" style={{ color: '#f59e0b' }} onClick={() => onViewCollection(c.id, 'monitor')}><Activity size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
