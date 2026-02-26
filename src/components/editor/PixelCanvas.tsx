import { useRef, useEffect } from 'preact/hooks';
import { canvasWidth, canvasHeight, zoom, showGrid } from '@/signals/editor';

/* ============================================
   PixelCanvas Component (Placeholder)
   ============================================ */

export function PixelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvasWidth.value;
    const h = canvasHeight.value;
    const z = zoom.value;
    const pixelWidth = w * z;
    const pixelHeight = h * z;

    canvas.width = pixelWidth;
    canvas.height = pixelHeight;

    ctx.fillStyle = 'var(--canvas-bg)';
    ctx.fillRect(0, 0, pixelWidth, pixelHeight);

    /* Checkerboard background */
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const isEven = (x + y) % 2 === 0;
        ctx.fillStyle = isEven ? '#2A2A2A' : '#3A3A3A';
        ctx.fillRect(x * z, y * z, z, z);
      }
    }

    /* Grid lines */
    if (showGrid.value && z >= 4) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;

      for (let x = 0; x <= w; x++) {
        ctx.beginPath();
        ctx.moveTo(x * z + 0.5, 0);
        ctx.lineTo(x * z + 0.5, pixelHeight);
        ctx.stroke();
      }

      for (let y = 0; y <= h; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * z + 0.5);
        ctx.lineTo(pixelWidth, y * z + 0.5);
        ctx.stroke();
      }
    }

    /* Placeholder text */
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = `${Math.max(12, z * 2)}px var(--font-pixel), monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Canvas', pixelWidth / 2, pixelHeight / 2);
  }, []);

  return (
    <div class="flex items-center justify-center w-full h-full overflow-auto">
      <canvas
        ref={canvasRef}
        class="cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

export default PixelCanvas;
