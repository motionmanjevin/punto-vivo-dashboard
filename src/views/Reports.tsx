import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import type { AppState, Report } from '@/lib/types';
import { useT } from '@/lib/i18n';
import { getStatusPill, fmtDateTime } from '@/lib/data';

interface Props {
  state: AppState;
  onViewReport: (id: string) => void;
}

export default function Reports({ state, onViewReport }: Props) {
  const t = useT(state.lang);
  const lang = state.lang;
  const [search, setSearch] = useState('');

  const filtered = state.reports.filter(r =>
    !search || [r.id, r.citizen, r.type, r.typeEs, r.status, r.agency].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rise">
      <div className="card">
        <div className="card-h">
          <h3>{t('reports.title')}</h3>
          <span className="sub">{state.reports.length} {t('common.all').toLowerCase()}</span>
          <div className="search-box" style={{ marginLeft: 'auto' }}>
            <span className="si"><Search size={14} /></span>
            <input className="input" placeholder={`${t('common.search')}...`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card-b" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>
                <th>{t('reports.id')}</th><th>{t('reports.citizen')}</th><th>{t('reports.type')}</th>
                <th>{t('reports.ai_class')}</th><th>{t('reports.location')}</th><th>{t('reports.reported')}</th>
                <th>{t('reports.agency')}</th><th>{t('reports.status')}</th><th>{t('reports.actions')}</th>
              </tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td className="mono" style={{ color: 'var(--sky)' }}>{r.id}</td>
                    <td>{r.citizen}</td>
                    <td>{lang === 'es' ? r.typeEs : r.type}</td>
                    <td>{r.aiClass} <span className="mono" style={{ fontSize: 10, color: 'var(--dim)' }}>({Math.round(parseFloat(r.confidence) * 100)}%)</span></td>
                    <td className="mono" style={{ fontSize: 10.5 }}>{r.location[0].toFixed(4)}, {r.location[1].toFixed(4)}</td>
                    <td className="mono">{fmtDateTime(r.reportedAt, lang)}</td>
                    <td>{r.agency}</td>
                    <td><span className={`pill ${getStatusPill(r.status)}`}><span className="pd" />{lang === 'es' ? r.statusEs : r.status}</span></td>
                    <td><button className="btn sm" onClick={() => onViewReport(r.id)}><Eye size={12} /> {t('reports.view')}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
