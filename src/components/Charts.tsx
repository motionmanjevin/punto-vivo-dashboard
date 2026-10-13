import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

interface ChartCanvasProps {
  config: ChartConfiguration;
  height?: number;
}

export default function ChartCanvas({ config, height = 260 }: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    chartRef.current = new Chart(canvas, config);
    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} style={{ height }} />;
}
