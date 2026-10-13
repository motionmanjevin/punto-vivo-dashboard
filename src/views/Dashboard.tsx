import { Shield, Users, Clock, Truck, Award } from 'lucide-react';
import ChartCanvas from '@/components/Charts';
import MapboxMap from '@/components/MapboxMap';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';
import { generateChartData, generateCategoryData, getStatusPill } from '@/lib/data';
import logoImg from '@/imports/Untitled_-_September_02__2026_at_03.21.36.png';

interface Props { state: AppState; }

function KpiCard({ icon: Icon, value, label, sub, color }: { icon: React.ElementType; value: string | number; label: string; sub?: string; color: string }) {
  return (
    <div className="stat rise">
      <div className="lb">
        <span className="ic" style={{ background: color + '22', color }}><Icon size={15} /></span>
        {label}
      </div>
      <div className="vl big" style={{ color }}>{value}</div>
      {sub && <div className="sb2">{sub}</div>}
    </div>
  );
}

export default function Dashboard({ state }: Props) {
  const t = useT(state.lang);
  const s = state.stats;
  const lang = state.lang;

  const chartDays = parseInt(state.chartRange);
  const chartData = generateChartData(chartDays, lang);
  const categoryData = generateCategoryData(lang);

  const dateStr = new Date().toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const activityConfig = {
    type: 'line' as const,
    data: {
      labels: chartData.map(d => d.date),
      datasets: [
        { label: t('dashboard.reports'), data: chartData.map(d => d.reports), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.15)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0 },
        { label: t('dashboard.completed'), data: chartData.map(d => d.completed), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0 },
        { label: t('dashboard.scheduled'), data: chartData.map(d => d.scheduled), borderColor: '#8b5cf6', tension: 0.4, borderWidth: 2, pointRadius: 0 },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#a1a1aa', font: { size: 11 }, boxWidth: 10 } } }, scales: { x: { ticks: { color: '#71717a', maxTicksLimit: 10 }, grid: { color: '#27272a' } }, y: { ticks: { color: '#71717a' }, grid: { color: '#27272a' } } } },
  };

  const DONUT_COLORS = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#84cc16','#f97316','#64748b'];
  const categoryConfig = {
    type: 'doughnut' as const,
    data: {
      labels: categoryData.map(d => d.name),
      datasets: [{ data: categoryData.map(d => d.value), backgroundColor: DONUT_COLORS, borderWidth: 0, hoverOffset: 6 }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' as const, labels: { color: '#a1a1aa', font: { size: 10 }, boxWidth: 10 } } }, cutout: '68%' },
  };

  return (
    <div className="rise">
      <div className="hero">
        <img className="hero-bg" src={logoImg} alt="" />
        <div className="hero-veil" />
        <div className="hero-in">
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="hero-kicker"><Shield size={12} /> {t('dashboard.kicker')}</div>
            <h2 className="hero-title">{t('dashboard.title')}</h2>
            <div className="hero-sub">
              <span>{dateStr}</span>
              <span className={`conn-pill ${state.connection}`}><span className="dot" />{state.connection === 'live' ? t('dashboard.live') : t('dashboard.reconnecting')}</span>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-chip rise" style={{ animationDelay: '120ms' }}><div className="hc-l">{t('dashboard.reports')}</div><div className="hc-v t-sky">{s.reports.toLocaleString()}</div></div>
            <div className="hero-chip rise" style={{ animationDelay: '200ms' }}><div className="hc-l">{t('dashboard.completed')}</div><div className="hc-v t-green">{s.completed.toLocaleString()}</div></div>
            <div className="hero-chip rise" style={{ animationDelay: '280ms' }}><div className="hc-l">{t('dashboard.ecopoints')}</div><div className="hc-v t-violet">{s.ecopoints}</div></div>
          </div>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 20 }}>
        <KpiCard icon={Users} value={s.reports.toLocaleString()} label={t('dashboard.reports')} sub={`+8.4% ${t('dashboard.this_month')}`} color="#38bdf8" />
        <KpiCard icon={Clock} value={s.pending} label={t('dashboard.pending')} sub={`${s.scheduled} ${t('dashboard.scheduled').toLowerCase()}`} color="#f59e0b" />
        <KpiCard icon={Truck} value={s.active} label={t('dashboard.active')} sub={`${s.completed.toLocaleString()} ${t('dashboard.completed').toLowerCase()}`} color="#22c55e" />
        <KpiCard icon={Award} value={s.rewards.toLocaleString()} label={t('dashboard.rewards')} sub={`${s.citizens.toLocaleString()} ${t('dashboard.citizens').toLowerCase()}`} color="#a78bfa" />
      </div>

      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card rise">
          <div className="card-h"><h3>{t('dashboard.waste_activity')}</h3><span className="sub">{t('dashboard.this_month')}</span></div>
          <div className="card-b" style={{ height: 280 }}><ChartCanvas config={activityConfig} height={248} /></div>
        </div>
        <div className="card rise">
          <div className="card-h"><h3>{t('dashboard.categories')}</h3></div>
          <div className="card-b" style={{ height: 280 }}><ChartCanvas config={categoryConfig} height={248} /></div>
        </div>
      </div>

      <div className="card rise" style={{ marginBottom: 20 }}>
        <div className="card-h"><h3>{t('dashboard.map_title')}</h3><span className="sub">{state.reports.length} {t('dashboard.hotspots').toLowerCase()}</span></div>
        <div className="card-b" style={{ padding: 0 }}>
          <MapboxMap id="dashMap" reports={state.reports} />
        </div>
      </div>

      <div className="card rise">
        <div className="card-h"><h3>{t('dashboard.agency_ops')}</h3></div>
        <div className="card-b" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>
                <th>{t('agencies.name')}</th><th>{t('agencies.requests')}</th><th>{t('agencies.pending')}</th>
                <th>{t('agencies.completed')}</th><th>{t('agencies.vehicles')}</th><th>{t('agencies.response')}</th><th>{t('common.status')}</th>
              </tr></thead>
              <tbody>
                {state.agencies.slice(0, 6).map(a => (
                  <tr key={a.id}>
                    <td><b>{a.name}</b><div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{a.type}</div></td>
                    <td className="mono">{a.requests}</td>
                    <td className="mono t-amber">{a.pending}</td>
                    <td className="mono t-green">{a.completed}</td>
                    <td className="mono">{a.vehicles}</td>
                    <td className="mono">{a.responseTime}{t('agencies.min')}</td>
                    <td><span className={`pill ${a.status === 'Active' ? 'green' : 'red'}`}><span className="pd" />{a.status}</span></td>
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

// suppress unused import warning
void getStatusPill;
