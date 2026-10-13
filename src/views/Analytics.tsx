import ChartCanvas from '@/components/Charts';
import MapboxMap from '@/components/MapboxMap';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';

interface Props { state: AppState; }

export default function Analytics({ state }: Props) {
  const t = useT(state.lang);

  const chartOpts = { color: '#a1a1aa', grid: '#27272a', dim: '#71717a' };
  const efficiencyConfig = {
    type: 'bar' as const,
    data: { labels: [t('analytics.resp_time'), t('analytics.coll_time'), t('analytics.ontime')], datasets: [{ label: t('analytics.minutes_pct'), data: [45, 28, 87], backgroundColor: ['#6366f1', '#10b981', '#f59e0b'], borderRadius: 6, borderSkipped: false }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartOpts.color, boxWidth: 10 } } }, scales: { x: { ticks: { color: chartOpts.dim }, grid: { color: chartOpts.grid } }, y: { ticks: { color: chartOpts.dim }, grid: { color: chartOpts.grid } } } },
  };

  const trendsConfig = {
    type: 'line' as const,
    data: { labels: [t('analytics.lun'), t('analytics.mar'), t('analytics.mie'), t('analytics.jue'), t('analytics.vie'), t('analytics.sab'), t('analytics.dom')], datasets: [{ label: t('analytics.reports'), data: [45, 52, 38, 65, 48, 72, 55], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.12)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0 }, { label: t('analytics.collections'), data: [38, 45, 32, 58, 42, 65, 48], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartOpts.color, boxWidth: 10 } } }, scales: { x: { ticks: { color: chartOpts.dim }, grid: { color: chartOpts.grid } }, y: { ticks: { color: chartOpts.dim }, grid: { color: chartOpts.grid } } } },
  };

  const performanceConfig = {
    type: 'bar' as const,
    data: { labels: state.agencies.slice(0, 6).map(a => a.name.substring(0, 10)), datasets: [{ label: t('analytics.requests'), data: state.agencies.slice(0, 6).map(a => a.requests), backgroundColor: '#6366f1', borderRadius: 4 }, { label: t('analytics.completed10'), data: state.agencies.slice(0, 6).map(a => Math.round(a.completed / 10)), backgroundColor: '#10b981', borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const, plugins: { legend: { labels: { color: chartOpts.color, boxWidth: 10 } } }, scales: { x: { ticks: { color: chartOpts.dim }, grid: { color: chartOpts.grid } }, y: { ticks: { color: chartOpts.dim, font: { size: 9 } }, grid: { color: chartOpts.grid } } } },
  };

  const utilizationConfig = {
    type: 'bar' as const,
    data: { labels: state.ecopoints.map(e => e.name.replace('Ecopunto ', '')), datasets: [{ label: t('analytics.occupancy'), data: state.ecopoints.map(e => Math.round(e.occupancy / e.capacity * 100)), backgroundColor: state.ecopoints.map(e => e.occupancy / e.capacity > 0.9 ? '#ef4444' : e.occupancy / e.capacity > 0.7 ? '#f59e0b' : '#10b981'), borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartOpts.color, boxWidth: 10 } } }, scales: { x: { ticks: { color: chartOpts.dim, font: { size: 9 } }, grid: { color: chartOpts.grid } }, y: { ticks: { color: chartOpts.dim }, grid: { color: chartOpts.grid }, max: 100 } } },
  };

  return (
    <div className="rise">
      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card"><div className="card-h"><h3>{t('analytics.efficiency')}</h3></div><div className="card-b" style={{ height: 260 }}><ChartCanvas config={efficiencyConfig} height={228} /></div></div>
        <div className="card"><div className="card-h"><h3>{t('analytics.trends')}</h3></div><div className="card-b" style={{ height: 260 }}><ChartCanvas config={trendsConfig} height={228} /></div></div>
      </div>
      <div className="grid g2" style={{ marginBottom: 20 }}>
        <div className="card"><div className="card-h"><h3>{t('analytics.performance')}</h3></div><div className="card-b" style={{ height: 260 }}><ChartCanvas config={performanceConfig} height={228} /></div></div>
        <div className="card"><div className="card-h"><h3>{t('analytics.utilization')}</h3></div><div className="card-b" style={{ height: 260 }}><ChartCanvas config={utilizationConfig} height={228} /></div></div>
      </div>
      <div className="card">
        <div className="card-h"><h3>{t('analytics.hotspots')}</h3><span className="sub">Bogotá</span></div>
        <div className="card-b" style={{ padding: 0 }}>
          <MapboxMap id="heatmapMap" reports={state.reports} />
        </div>
      </div>
    </div>
  );
}
