import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';

interface Props { state: AppState; }

export default function Agencies({ state }: Props) {
  const t = useT(state.lang);

  return (
    <div className="rise">
      <div className="grid g2">
        {state.agencies.map(a => (
          <div className="card" key={a.id}>
            <div className="card-h">
              <h3>{a.name}</h3>
              <span className={`pill ${a.status === 'Active' ? 'green' : 'red'}`}><span className="pd" />{a.status}</span>
            </div>
            <div className="card-b">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><div className="label">{t('agencies.type')}</div><div style={{ fontWeight: 600 }}>{a.type}</div></div>
                <div><div className="label">{t('agencies.contact')}</div><div style={{ fontSize: 11, color: 'var(--muted)', wordBreak: 'break-all' }}>{a.contact}</div></div>
                <div><div className="label">{t('agencies.requests')}</div><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--sky)' }}>{a.requests}</div></div>
                <div><div className="label">{t('agencies.pending')}</div><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--amber)' }}>{a.pending}</div></div>
                <div><div className="label">{t('agencies.completed')}</div><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>{a.completed}</div></div>
                <div><div className="label">{t('agencies.vehicles')}</div><div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--violet)' }}>{a.vehicles}</div></div>
                <div style={{ gridColumn: '1 / -1' }}><div className="label">{t('agencies.response')}</div><div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{a.responseTime} {t('agencies.min')}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
