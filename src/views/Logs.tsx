import { useState } from 'react';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';
import { getLogTypeColor, fmtTime } from '@/lib/data';

interface Props { state: AppState; }

export default function Logs({ state }: Props) {
  const t = useT(state.lang);
  const lang = state.lang;
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = state.logs.filter(l => {
    const matchType = !typeFilter || l.type === typeFilter;
    const matchDate = !dateFilter || l.timestamp.startsWith(dateFilter);
    return matchType && matchDate;
  });

  return (
    <div className="rise">
      <div className="card">
        <div className="card-h">
          <h3>{t('logs.title')}</h3>
          <span className="sub">{state.logs.length} {t('logs.events')}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select className="select" style={{ width: 140 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">{t('logs.all_types')}</option>
              {['REPORT', 'COLLECTION', 'VEHICLE', 'CITIZEN', 'SYSTEM', 'AGENCY'].map(tp => <option key={tp}>{tp}</option>)}
            </select>
            <input type="date" className="input" style={{ width: 140 }} value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          </div>
        </div>
        <div className="card-b" style={{ padding: 0 }}>
          <div className="log-stream">
            {filtered.map(l => (
              <div className="log-line" key={l.id}>
                <span className="log-time">{fmtTime(l.timestamp, lang)}</span>
                <span className={`log-type ${getLogTypeColor(l.type)}`}>{l.type}</span>
                <span className="log-msg">{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
