import { useState } from 'react';
import { Search } from 'lucide-react';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';
import { fmtDate } from '@/lib/data';

interface Props { state: AppState; }

export default function Citizens({ state }: Props) {
  const t = useT(state.lang);
  const lang = state.lang;
  const [search, setSearch] = useState('');

  const filtered = state.citizens.filter(c =>
    !search || [c.name, c.email, c.phone, c.id].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rise">
      <div className="card">
        <div className="card-h">
          <h3>{t('citizens.title')}</h3>
          <span className="sub">{state.citizens.length} {t('common.all').toLowerCase()}</span>
          <div className="search-box" style={{ marginLeft: 'auto' }}>
            <span className="si"><Search size={14} /></span>
            <input className="input" placeholder={`${t('common.search')}...`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card-b" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>
                <th>{t('citizens.name')}</th><th>{t('citizens.phone')}</th><th>{t('citizens.email')}</th>
                <th>{t('citizens.reports')}</th><th>{t('citizens.collections')}</th><th>{t('citizens.points')}</th>
                <th>{t('citizens.rewards')}</th><th>{t('citizens.last')}</th><th>{t('citizens.status')}</th>
              </tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><b>{c.name}</b><div className="mono" style={{ fontSize: 10, color: 'var(--dim)' }}>{c.id}</div></td>
                    <td className="mono" style={{ fontSize: 11 }}>{c.phone}</td>
                    <td style={{ fontSize: 11 }}>{c.email}</td>
                    <td className="mono">{c.reports}</td>
                    <td className="mono">{c.collections}</td>
                    <td className="mono t-sky" style={{ fontWeight: 700 }}>{c.points.toLocaleString()}</td>
                    <td className="mono">{c.rewards}</td>
                    <td className="mono">{fmtDate(c.lastActivity, lang)}</td>
                    <td><span className={`pill ${c.status === 'Active' ? 'green' : 'red'}`}><span className="pd" />{c.status}</span></td>
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
