import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Report, EcoPoint, Vehicle } from '@/lib/types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string || 'pk.eyJ1IjoiaWthbmFiYSIsImEiOiJjbXRveXh4MWEwazY5MnpyMXlxaGx3dWM4In0.HrVNDmdA0tOSrcQCV3riuw';

interface MapboxMapProps {
  id: string;
  center?: [number, number];
  zoom?: number;
  reports?: Report[];
  ecopoints?: EcoPoint[];
  vehicles?: Vehicle[];
  className?: string;
}

const STATUS_COLOR: Record<string, string> = {
  Open: '#10b981',
  Busy: '#f59e0b',
  'Near Capacity': '#f59e0b',
  Full: '#ef4444',
  Closed: '#ef4444',
};

// ── Fallback map rendered when Mapbox tiles can't be fetched ────────────────

function FallbackMap({ center, reports, ecopoints, vehicles, className }: {
  center: [number, number];
  reports?: Report[];
  ecopoints?: EcoPoint[];
  vehicles?: Vehicle[];
  className: string;
}) {
  // Bogotá bounding box (approx)
  const LAT_MIN = 4.45, LAT_MAX = 4.85;
  const LNG_MIN = -74.25, LNG_MAX = -73.95;

  function toXY(lat: number, lng: number, w: number, h: number) {
    const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * w;
    const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * h;
    return { x, y };
  }

  const W = 800, H = 420;

  const reportPins = (reports ?? []).slice(0, 50).map(r => {
    const color = r.status === 'Completed' ? '#10b981' : r.status === 'Cancelled' ? '#ef4444' : '#f59e0b';
    const { x, y } = toXY(r.location[0], r.location[1], W, H);
    return { x, y, color, label: r.id, sub: r.type };
  });

  const ecoPins = (ecopoints ?? []).map(ep => {
    const color = STATUS_COLOR[ep.status] ?? '#6366f1';
    const { x, y } = toXY(ep.lat, ep.lng, W, H);
    return { x, y, color, label: ep.name, square: true };
  });

  const vehiclePins = (vehicles ?? []).filter(v => v.status !== 'Offline' && v.status !== 'Maintenance').map(v => {
    const { x, y } = toXY(v.location[0], v.location[1], W, H);
    return { x, y, color: '#6366f1', label: v.id };
  });

  const { x: cx, y: cy } = toXY(center[0], center[1], W, H);

  return (
    <div className={className} style={{ position: 'relative', background: '#0f0f14', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        {/* Grid */}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={i * (W / 11)} y1={0} x2={i * (W / 11)} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * (H / 6)} x2={W} y2={i * (H / 6)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        ))}
        {/* Bogotá outline hint — rough poly */}
        <ellipse cx={W * 0.5} cy={H * 0.48} rx={W * 0.38} ry={H * 0.42} fill="rgba(99,102,241,0.04)" stroke="rgba(99,102,241,0.1)" strokeWidth={1} />

        {/* Center crosshair */}
        {reportPins.length === 1 && (
          <>
            <circle cx={cx} cy={cy} r={28} fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth={1.5} />
            <circle cx={cx} cy={cy} r={18} fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth={1} />
            <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="rgba(56,189,248,0.6)" strokeWidth={1} />
            <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="rgba(56,189,248,0.6)" strokeWidth={1} />
          </>
        )}

        {/* Report pins */}
        {reportPins.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill={p.color} opacity={0.85} />
            <circle cx={p.x} cy={p.y} r={5} fill="none" stroke={p.color} strokeWidth={1.5} opacity={0.4} />
          </g>
        ))}

        {/* EcoPoint pins */}
        {ecoPins.map((p, i) => (
          <rect key={i} x={p.x - 5} y={p.y - 5} width={10} height={10} rx={2} fill={p.color} opacity={0.85} />
        ))}

        {/* Vehicle pins */}
        {vehiclePins.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={6} fill="#6366f1" opacity={0.9} />
        ))}

        {/* Labels: city name */}
        <text x={W * 0.5} y={H * 0.5} textAnchor="middle" fill="rgba(255,255,255,0.06)" fontSize={64} fontWeight={800} fontFamily="system-ui" letterSpacing={8}>BOGOTÁ</text>
      </svg>

      {/* Overlay badge */}
      <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 10px' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
        <span style={{ fontSize: 10, fontFamily: 'ui-monospace,monospace', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>
          BOGOTÁ · {(reports?.length ?? 0) + (ecopoints?.length ?? 0) + (vehiclePins.length ?? 0)} puntos
        </span>
      </div>
      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        {reportPins.length > 0 && <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />Reportes</span>}
        {ecoPins.length > 0 && <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: 2, background: '#10b981', display: 'inline-block' }} />Ecopuntos</span>}
        {vehiclePins.length > 0 && <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />Vehículos</span>}
      </div>
    </div>
  );
}

// ── Main MapboxMap ────────────────────────────────────────────────────────────

export default function MapboxMap({
  id,
  center = [4.7110, -74.0721],
  zoom = 11,
  reports,
  ecopoints,
  vehicles,
  className = 'map-container',
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || failed) return;

    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    el.innerHTML = '';

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: el,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [center[1], center[0]],
        zoom,
        attributionControl: false,
      });
    } catch {
      setFailed(true);
      return;
    }

    // Only fall back if the style itself fails to load (fatal), not on tile errors
    map.on('error', (e) => {
      const msg = (e as { error?: { message?: string } }).error?.message ?? '';
      if (msg.includes('Failed to load style') || msg.includes('access_token')) {
        setFailed(true);
        try { map.remove(); } catch { /* ignore */ }
      }
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, maxWidth: '240px', offset: 12 });
    popupRef.current = popup;

    const addMarkers = () => {
      if (reports) {
        reports.slice(0, 50).forEach(r => {
          const color = r.status === 'Completed' ? '#10b981' : r.status === 'Cancelled' ? '#ef4444' : '#f59e0b';
          const el2 = document.createElement('div');
          el2.style.cssText = `width:12px;height:12px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.5);cursor:pointer;box-shadow:0 0 8px ${color}88;transition:transform .15s;`;
          el2.addEventListener('mouseenter', () => { el2.style.transform = 'scale(1.6)'; });
          el2.addEventListener('mouseleave', () => { el2.style.transform = 'scale(1)'; });
          new mapboxgl.Marker({ element: el2 }).setLngLat([r.location[1], r.location[0]]).addTo(map);
          el2.addEventListener('click', () => {
            popup.setLngLat([r.location[1], r.location[0]]).setHTML(`
              <div style="font-family:system-ui;padding:2px">
                <div style="font-family:ui-monospace,monospace;font-size:11px;font-weight:700;color:#818cf8;margin-bottom:4px">${r.id}</div>
                <div style="font-size:12px;font-weight:600;color:#f4f4f5;margin-bottom:2px">${r.citizen}</div>
                <div style="font-size:11px;color:#a1a1aa">${r.type}</div>
                <div style="margin-top:6px"><span style="background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.25);border-radius:999px;padding:2px 8px;font-size:10px;font-family:ui-monospace,monospace;font-weight:600">${r.status}</span></div>
              </div>`).addTo(map);
          });
        });
      }

      if (ecopoints) {
        ecopoints.forEach(ep => {
          const color = STATUS_COLOR[ep.status] ?? '#6366f1';
          const el2 = document.createElement('div');
          el2.style.cssText = `width:16px;height:16px;border-radius:4px;background:${color};border:2px solid rgba(255,255,255,0.6);cursor:pointer;box-shadow:0 0 12px ${color}99;display:flex;align-items:center;justify-content:center;transition:transform .15s;`;
          el2.innerHTML = `<svg width="9" height="9" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
          el2.addEventListener('mouseenter', () => { el2.style.transform = 'scale(1.4)'; });
          el2.addEventListener('mouseleave', () => { el2.style.transform = 'scale(1)'; });
          new mapboxgl.Marker({ element: el2 }).setLngLat([ep.lng, ep.lat]).addTo(map);
          el2.addEventListener('click', () => {
            const pct = Math.round(ep.occupancy / ep.capacity * 100);
            popup.setLngLat([ep.lng, ep.lat]).setHTML(`
              <div style="font-family:system-ui;padding:2px">
                <div style="font-size:12px;font-weight:700;color:#f4f4f5;margin-bottom:2px">${ep.name}</div>
                <div style="font-size:11px;color:#a1a1aa;margin-bottom:6px">${ep.address}</div>
                <div style="background:#27272a;border-radius:999px;height:5px;overflow:hidden;margin-bottom:4px"><div style="width:${pct}%;height:100%;background:${color};border-radius:999px"></div></div>
                <div style="display:flex;justify-content:space-between;font-size:10px;color:#71717a"><span>${ep.occupancy}/${ep.capacity}</span><span style="color:${color};font-weight:600">${ep.status}</span></div>
              </div>`).addTo(map);
          });
        });
      }

      if (vehicles) {
        vehicles.filter(v => v.status !== 'Offline' && v.status !== 'Maintenance').forEach(v => {
          const el2 = document.createElement('div');
          el2.style.cssText = `width:14px;height:14px;border-radius:50%;background:#6366f1;border:2px solid rgba(255,255,255,0.6);cursor:pointer;box-shadow:0 0 10px rgba(99,102,241,0.7);transition:transform .15s;`;
          el2.addEventListener('mouseenter', () => { el2.style.transform = 'scale(1.5)'; });
          el2.addEventListener('mouseleave', () => { el2.style.transform = 'scale(1)'; });
          new mapboxgl.Marker({ element: el2 }).setLngLat([v.location[1], v.location[0]]).addTo(map);
          el2.addEventListener('click', () => {
            popup.setLngLat([v.location[1], v.location[0]]).setHTML(`
              <div style="font-family:system-ui;padding:2px">
                <div style="font-family:ui-monospace,monospace;font-size:11px;font-weight:700;color:#818cf8;margin-bottom:3px">${v.id} · ${v.plate}</div>
                <div style="font-size:12px;font-weight:600;color:#f4f4f5">${v.driver}</div>
                <div style="font-size:11px;color:#a1a1aa;margin-top:2px">${v.type} · ${v.load}/${v.capacity}t</div>
                <div style="margin-top:6px"><span style="background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.25);border-radius:999px;padding:2px 8px;font-size:10px;font-family:ui-monospace,monospace">${v.status}</span></div>
              </div>`).addTo(map);
          });
        });
      }
    };

    map.on('load', addMarkers);
    map.on('click', () => popup.remove());

    return () => {
      popup.remove();
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, failed]);

  if (failed) {
    return <FallbackMap center={center} reports={reports} ecopoints={ecopoints} vehicles={vehicles} className={className} />;
  }

  return <div ref={containerRef} className={className} style={{ zIndex: 0 }} />;
}
