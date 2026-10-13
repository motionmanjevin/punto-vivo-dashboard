import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Camera, MapPin, AlertTriangle, Activity,
  Zap, TrendingUp, Clock, ChevronRight, CheckCircle,
} from 'lucide-react';
import MapboxMap from '@/components/MapboxMap';
import ChartCanvas from '@/components/Charts';
import type { AppState } from '@/lib/types';
import { useT } from '@/lib/i18n';
import timelapse1 from '@/imports/City_timelapse_of_rubbish_accumu__2K_202609052112.jpeg';
import timelapse2 from '@/imports/Time-lapse_of_city_rubbish_accum__2K_202609052112.jpeg';

interface Props { state: AppState; }

const V1 = 'https://pub-301b1e4ed01242418ea42029b365d1b8.r2.dev/Security_camera_capturing_street%E2%80%A6_202609021443.mp4';
const V2 = 'https://pub-301b1e4ed01242418ea42029b365d1b8.r2.dev/Security_camera_overlooking_stre%E2%80%A6_202609021443.mp4';

const CAMERAS = [
  { id: 'CAM-041', zone: 'Kennedy — Cll 38 Sur', lat: 4.628, lng: -74.163, status: 'alert',    conf: 94, labelKey: 'ai.cam_label_041', time: '14s ago', src: V1, box: { x: 0.10, y: 0.38, w: 0.45, h: 0.50 } },
  { id: 'CAM-118', zone: 'Suba — Tv. 91',        lat: 4.741, lng: -74.084, status: 'scanning', conf: 61, labelKey: 'ai.cam_label_118', time: '2m ago',  src: V2, box: { x: 0.20, y: 0.32, w: 0.40, h: 0.52 } },
];

const PREDICTIONS_DATA = [
  { id: 'PRD-001', zoneKey: 'ai.pred_zone_001', conf: 94, eta: '~15 min', catKey: 'ai.cat_furniture',    volKey: 'ai.vol_high', cameras: 3, status: 'critical' },
  { id: 'PRD-002', zoneKey: 'ai.pred_zone_002', conf: 88, eta: '~22 min', catKey: 'ai.cat_appliances',   volKey: 'ai.vol_med',  cameras: 2, status: 'high'     },
  { id: 'PRD-003', zoneKey: 'ai.pred_zone_003', conf: 91, eta: '~10 min', catKey: 'ai.cat_mixed',        volKey: 'ai.vol_high', cameras: 4, status: 'critical' },
  { id: 'PRD-004', zoneKey: 'ai.pred_zone_004', conf: 78, eta: '~35 min', catKey: 'ai.cat_electronics',  volKey: 'ai.vol_low',  cameras: 1, status: 'medium'   },
  { id: 'PRD-005', zoneKey: 'ai.pred_zone_005', conf: 61, eta: '~50 min', catKey: 'ai.cat_construction', volKey: 'ai.vol_med',  cameras: 2, status: 'low'      },
];

const MODEL_STATS_DATA = [
  { labelKey: 'ai.stat_precision',   value: '91.4%', delta: '+2.1%', color: '#10b981' },
  { labelKey: 'ai.stat_false_pos',   value: '4.8%',  delta: '-0.6%', color: '#6366f1' },
  { labelKey: 'ai.stat_detect_time', value: '1.2s',  delta: '-0.3s', color: '#8b5cf6' },
  { labelKey: 'ai.stat_active_cams', value: '847',   delta: '+12',   color: '#f59e0b' },
];

const STATUS_KEYS_META = {
  alert:    { color: '#ef4444', labelKey: 'ai.status_alert',    pulse: true  },
  scanning: { color: '#f59e0b', labelKey: 'ai.status_scanning', pulse: true  },
  clear:    { color: '#10b981', labelKey: 'ai.status_clear',    pulse: false },
};

const CONF_COLOR = (c: number) => c >= 85 ? '#ef4444' : c >= 60 ? '#f59e0b' : '#10b981';

// ── CameraCard ────────────────────────────────────────────────────────────────

function CameraCard({ cam, selected, onClick, t }: { cam: typeof CAMERAS[0]; selected: boolean; onClick: () => void; t: (k: string) => string }) {
  const meta = STATUS_KEYS_META[cam.status as keyof typeof STATUS_KEYS_META];
  const [ts, setTs] = useState('');

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTs(`${now.toISOString().slice(0, 10)}  ${now.toTimeString().slice(0, 8)}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="card"
      onClick={onClick}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.988 }}
      style={{ cursor: 'pointer', outline: selected ? '1.5px solid var(--sky)' : '1.5px solid transparent', overflow: 'hidden', padding: 0 }}
    >
      <div style={{ position: 'relative', background: '#000', overflow: 'hidden', aspectRatio: '16/9' }}>
        <video src={cam.src} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* AI bounding box — alert */}
        {cam.status === 'alert' && cam.box.w > 0 && (
          <motion.div animate={{ opacity: [0.6, 1, 0.75, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
            style={{ position: 'absolute', left: `${cam.box.x * 100}%`, top: `${cam.box.y * 100}%`, width: `${cam.box.w * 100}%`, height: `${cam.box.h * 100}%`, border: '1.5px solid #ef4444', borderRadius: 3, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: -12, left: 0, background: '#ef4444', color: '#fff', fontSize: 8.5, fontWeight: 700, padding: '1px 6px', borderRadius: 3, fontFamily: 'ui-monospace,monospace', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              {t('ai.waste_tag')} · {cam.conf}%
            </div>
          </motion.div>
        )}

        {/* Scanning circle */}
        {cam.status === 'scanning' && cam.box.w > 0 && (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', left: `${(cam.box.x + cam.box.w / 2) * 100}%`, top: `${(cam.box.y + cam.box.h / 2) * 100}%`, transform: 'translate(-50%,-50%)', width: 40, height: 40, border: '1.5px solid rgba(245,158,11,0.75)', borderTopColor: '#f59e0b', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: `${(cam.box.x + cam.box.w / 2) * 100}%`, top: `${(cam.box.y + cam.box.h / 2) * 100}%`, transform: 'translate(-50%, 26px)', fontSize: 8, fontWeight: 700, color: '#f59e0b', fontFamily: 'ui-monospace,monospace', letterSpacing: '0.05em', pointerEvents: 'none', whiteSpace: 'nowrap', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
              {t('ai.analyzing')}
            </div>
          </>
        )}

        {/* HUD */}
        <div style={{ position: 'absolute', top: 6, left: 8, pointerEvents: 'none', fontFamily: 'ui-monospace,monospace', fontSize: 9, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{cam.id} · REC</div>
        <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none' }}>
          {meta.pulse
            ? <motion.div animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, boxShadow: `0 0 5px ${meta.color}` }} />
            : <div style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />}
          <span style={{ fontSize: 8.5, fontWeight: 700, color: meta.color, fontFamily: 'ui-monospace,monospace', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{t(meta.labelKey)}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 6, left: 8, pointerEvents: 'none', fontFamily: 'ui-monospace,monospace', fontSize: 9, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.68)', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{ts}</div>
      </div>

      <div style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cam.zone}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>{t(cam.labelKey)}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: CONF_COLOR(cam.conf), fontFamily: 'ui-monospace,monospace' }}>{cam.conf}%</div>
          <div style={{ fontSize: 9, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cam.time}</div>
        </div>
      </div>
    </motion.div>
  );
}

function LiveBadge({ label }: { label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 999, padding: '2px 9px', fontSize: 10, fontWeight: 700, color: '#ef4444', letterSpacing: '0.06em', fontFamily: 'ui-monospace, monospace' }}>
      <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
      {label}
    </span>
  );
}

function PredictionRow({ p, index, t }: { p: typeof PREDICTIONS_DATA[0]; index: number; t: (k: string) => string }) {
  const statusColor = p.status === 'critical' ? '#ef4444' : p.status === 'high' ? '#f59e0b' : p.status === 'medium' ? '#6366f1' : '#10b981';
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: statusColor + '1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <AlertTriangle size={13} color={statusColor} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{t(p.zoneKey)}</div>
        <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--muted)', flexWrap: 'wrap' }}>
          <span>{t(p.catKey)}</span>
          <span>·</span>
          <span>{t(p.volKey)}</span>
          <span>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Camera size={10} color="var(--dim)" style={{ marginTop: 1 }} /><span>{p.cameras} cams</span></span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: CONF_COLOR(p.conf), fontFamily: 'ui-monospace,monospace' }}>{p.conf}%</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--dim)', justifyContent: 'flex-end' }}>
          <Clock size={9} />{p.eta}
          <ChevronRight size={10} color="var(--border)" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AIPrediction({ state }: Props) {
  const t = useT(state.lang);
  const [selectedCam, setSelectedCam] = useState<string | null>('CAM-041');
  const [processedFrames, setProcessedFrames] = useState(14820);
  useEffect(() => {
    const id = setInterval(() => setProcessedFrames(f => f + Math.floor(Math.random() * 4) + 2), 800);
    return () => clearInterval(id);
  }, []);

  const alertCameras    = CAMERAS.filter(c => c.status === 'alert');
  const scanningCameras = CAMERAS.filter(c => c.status === 'scanning');
  const selectedCamData = CAMERAS.find(c => c.id === selectedCam);

  const predictionReports = CAMERAS.filter(c => c.status !== 'clear').map((c, i) => ({
    id: `PRD-${i}`, citizen: c.zone, type: t(c.labelKey),
    status: c.status === 'alert' ? 'Pending' : 'Scheduled',
    location: [c.lat, c.lng] as [number, number],
    date: new Date().toISOString(), agency: '', category: 'Muebles', priority: c.status === 'alert' ? 'High' : 'Medium', notes: '',
  }));

  // Chart configs built here so they pick up the current language
  const chartWeeks = t.arr('ai.chart_weeks');
  const chartCats  = t.arr('ai.chart_cats');

  const accuracyConfig = {
    type: 'line' as const,
    data: {
      labels: chartWeeks,
      datasets: [
        { label: t('ai.chart_precision'), data: [84,86,87,89,88,90,91,91.4], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#10b981' },
        { label: t('ai.chart_false_pos'), data: [9.2,8.1,7.4,6.9,6.1,5.6,5.0,4.8], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', fill: true, tension: 0.4, borderWidth: 2, pointRadius: 2, pointBackgroundColor: '#6366f1' },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#a1a1aa', font: { size: 10 }, boxWidth: 8 } } }, scales: { x: { ticks: { color: '#71717a', font: { size: 9 } }, grid: { color: '#27272a' } }, y: { ticks: { color: '#71717a', font: { size: 9 } }, grid: { color: '#27272a' }, min: 0, max: 100 } } },
  };

  const categoryConfConfig = {
    type: 'bar' as const,
    data: {
      labels: chartCats,
      datasets: [{ label: t('ai.chart_detect'), data: [94,89,82,77,91], backgroundColor: ['#6366f1','#8b5cf6','#10b981','#f59e0b','#06b6d4'], borderRadius: 5, borderSkipped: false }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#71717a', font: { size: 9 } }, grid: { color: '#27272a' } }, y: { ticks: { color: '#71717a', font: { size: 9 } }, grid: { color: '#27272a' }, max: 100 } } },
  };

  const DATA_SOURCES = [
    { label: 'IDU · Red Vial Bogotá',    subKey: 'ai.ds_idu_sub',   status: 'online',  color: '#10b981' },
    { label: 'IDRD · Parques y Zonas',   subKey: 'ai.ds_idrd_sub',  status: 'online',  color: '#10b981' },
    { label: 'UAESP · Datos históricos', subKey: 'ai.ds_uaesp_sub', status: 'sync',    color: '#6366f1' },
    { label: 'Sec. de Movilidad',        subKey: 'ai.ds_movil_sub', status: 'online',  color: '#10b981' },
    { label: 'IDECA · Cartografía',      subKey: 'ai.ds_ideca_sub', status: 'online',  color: '#10b981' },
    { label: 'Modelo Climático IDEAM',   subKey: 'ai.ds_ideam_sub', status: 'delayed', color: '#f59e0b' },
  ];

  return (
    <div className="rise">

      {/* Header */}
      <div className="card" style={{ marginBottom: 18, padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} color="#6366f1" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {t('ai.title')} <LiveBadge label={t('ai.live')} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{t('ai.subtitle')}</div>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>{t('ai.frames')}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sky)', fontFamily: 'ui-monospace, monospace' }}>{processedFrames.toLocaleString()}</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>{t('ai.active_alerts')}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#ef4444', fontFamily: 'ui-monospace, monospace' }}>{alertCameras.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid g4" style={{ marginBottom: 18 }}>
        {MODEL_STATS_DATA.map((s, i) => (
          <motion.div key={s.labelKey} className="stat rise" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="lb"><span className="ic" style={{ background: s.color + '22', color: s.color }}><Activity size={13} /></span>{t(s.labelKey)}</div>
            <div className="vl big" style={{ color: s.color }}>{s.value}</div>
            <div className="sb2" style={{ color: s.color, fontSize: 10.5 }}><TrendingUp size={9} style={{ display: 'inline', marginRight: 3 }} />{s.delta} {t('common.prev_month')}</div>
          </motion.div>
        ))}
      </div>

      {/* Detection Timelapse */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-h">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Camera size={14} color="var(--sky)" /> {t('ai.timelapse_title') || 'Detection Timelapse — Bogotá'}</h3>
          <LiveBadge label={t('ai.live')} />
        </div>
        <div className="card-b">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { src: timelapse1, cam: 'CAM-041', zone: 'Kennedy — Cll 38 Sur', conf: 94, status: 'alert' },
              { src: timelapse2, cam: 'CAM-118', zone: 'Suba — Tv. 91', conf: 61, status: 'scanning' },
            ].map((feed) => (
              <div key={feed.cam} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#000' }}>
                <img src={feed.src} alt={`Timelapse ${feed.cam} — ${feed.zone}`} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                {/* HUD overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.7) 100%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: 8, left: 10, fontFamily: 'ui-monospace,monospace', fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.07em', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                  {feed.cam} · REC
                </div>
                <div style={{ position: 'absolute', top: 8, right: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <motion.div animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: feed.status === 'alert' ? '#ef4444' : '#f59e0b', boxShadow: `0 0 6px ${feed.status === 'alert' ? '#ef4444' : '#f59e0b'}` }} />
                  <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'ui-monospace,monospace', color: feed.status === 'alert' ? '#ef4444' : '#f59e0b', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                    {feed.status === 'alert' ? t('ai.status_alert') : t('ai.status_scanning')}
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{feed.zone}</div>
                    <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.65)', fontFamily: 'ui-monospace,monospace' }}>
                      {feed.status === 'alert' ? t('ai.cam_label_041') : t('ai.cam_label_118')}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: CONF_COLOR(feed.conf), fontFamily: 'ui-monospace,monospace', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{feed.conf}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Camera grid + prediction queue */}
      <div className="grid g2" style={{ marginBottom: 18 }}>
        {/* CCTV feeds */}
        <div className="card">
          <div className="card-h">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Camera size={14} color="var(--sky)" /> {t('ai.feeds_title')}</h3>
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 10, fontSize: 10.5, color: 'var(--muted)' }}>
              <span style={{ color: '#ef4444' }}>● {alertCameras.length} {t('ai.alerts_count')}</span>
              <span style={{ color: '#f59e0b' }}>● {scanningCameras.length} {t('ai.scanning_count')}</span>
            </span>
          </div>
          <div className="card-b">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {CAMERAS.map(cam => (
                <CameraCard key={cam.id} cam={cam} selected={selectedCam === cam.id} t={t}
                  onClick={() => setSelectedCam(cam.id === selectedCam ? null : cam.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Prediction queue + selected camera detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-h">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={14} color="#f59e0b" /> {t('ai.predictions_title')}</h3>
              <span className="sub">{t('ai.predictions_sub')}</span>
            </div>
            <div className="card-b" style={{ padding: '0 16px' }}>
              {PREDICTIONS_DATA.map((p, i) => <PredictionRow key={p.id} p={p} index={i} t={t} />)}
            </div>
          </div>

          <AnimatePresence>
            {selectedCamData && (
              <motion.div className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22 }}>
                <div className="card-h">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Camera size={14} color="var(--sky)" />{selectedCamData.id}
                  </h3>
                  <span className="sub">{selectedCamData.zone}</span>
                </div>
                <div className="card-b">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: t('ai.ai_confidence'), val: `${selectedCamData.conf}%`, color: CONF_COLOR(selectedCamData.conf) },
                      { label: t('common.status'), val: t(STATUS_KEYS_META[selectedCamData.status as keyof typeof STATUS_KEYS_META].labelKey), color: STATUS_KEYS_META[selectedCamData.status as keyof typeof STATUS_KEYS_META].color },
                      { label: t('ai.detection'), val: t(selectedCamData.labelKey), color: 'var(--text)' },
                      { label: t('ai.last_signal'), val: selectedCamData.time, color: 'var(--muted)' },
                    ].map(r => (
                      <div key={r.label} style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 10, color: 'var(--dim)', marginBottom: 3 }}>{r.label}</div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: r.color }}>{r.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Prediction map */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-h">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={14} color="var(--sky)" /> {t('ai.map_title')}</h3>
          <LiveBadge label={t('ai.live')} />
        </div>
        <div className="card-b" style={{ padding: 0 }}>
          <MapboxMap id="predictionMap" reports={predictionReports as never} />
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { color: '#ef4444', label: t('ai.legend_critical') },
            { color: '#f59e0b', label: t('ai.legend_probable') },
            { color: '#10b981', label: t('ai.legend_clear') },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--muted)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />{l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid g2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="card-h"><h3>{t('ai.model_evolution')}</h3><span className="sub">{t('ai.model_weeks')}</span></div>
          <div className="card-b" style={{ height: 220 }}><ChartCanvas config={accuracyConfig} height={190} /></div>
        </div>
        <div className="card">
          <div className="card-h"><h3>{t('ai.precision_cat')}</h3></div>
          <div className="card-b" style={{ height: 220 }}><ChartCanvas config={categoryConfConfig} height={190} /></div>
        </div>
      </div>

      {/* Data sources */}
      <div className="card">
        <div className="card-h"><h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} color="#10b981" /> {t('ai.data_sources')}</h3></div>
        <div className="card-b">
          <div className="grid g3" style={{ gap: 10 }}>
            {DATA_SOURCES.map(s => (
              <div key={s.label} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)', alignItems: 'center' }}>
                <motion.div animate={{ opacity: s.status === 'online' ? [1, 0.3, 1] : 1 }} transition={{ duration: 1.8, repeat: s.status === 'online' ? Infinity : 0 }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text)' }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--dim)' }}>{t(s.subKey)} · <span style={{ color: s.color }}>{t(`common.${s.status}`)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

