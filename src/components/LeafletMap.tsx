import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Report, EcoPoint, Vehicle } from '@/lib/types';
import { getStatusPill } from '@/lib/data';

interface LeafletMapProps {
  id: string;
  center?: [number, number];
  zoom?: number;
  reports?: Report[];
  ecopoints?: EcoPoint[];
  vehicles?: Vehicle[];
  className?: string;
}

export default function LeafletMap({ id, center = [4.7110, -74.0721], zoom = 11, reports, ecopoints, vehicles, className = 'map-container' }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const map = L.map(el, { zoomControl: true, attributionControl: false }).setView(center, zoom);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
    mapRef.current = map;

    if (reports) {
      reports.slice(0, 30).forEach(r => {
        L.circleMarker(r.location, { radius: 8, fillColor: '#f59e0b', color: '#fff', weight: 2, fillOpacity: 0.8 })
          .addTo(map)
          .bindPopup(`<b>${r.id}</b><br/>${r.citizen}<br/>${r.type}<br/>${r.status}`);
      });
    }

    if (ecopoints) {
      ecopoints.forEach(ep => {
        const color = ep.status === 'Open' ? '#22c55e' : ep.status === 'Busy' ? '#f59e0b' : '#ef4444';
        L.circleMarker([ep.lat, ep.lng], { radius: 10, fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.9 })
          .addTo(map)
          .bindPopup(`<b>${ep.name}</b><br/>${ep.address}<br/>${ep.occupancy}/${ep.capacity}<br/>${ep.status}`);
      });
    }

    if (vehicles) {
      vehicles.filter(v => v.status !== 'Offline' && v.status !== 'Maintenance').forEach(v => {
        L.circleMarker(v.location, { radius: 9, fillColor: '#38bdf8', color: '#fff', weight: 2, fillOpacity: 0.9 })
          .addTo(map)
          .bindPopup(`<b>${v.id}</b><br/>${v.driver}<br/>${v.status}`);
      });
    }

    return () => { map.remove(); mapRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // suppress TS unused import warning
  void getStatusPill;

  return <div ref={containerRef} className={className} style={{ zIndex: 0 }} />;
}
