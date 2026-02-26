const COLORS = ['var(--primary)', 'var(--accent)', 'var(--secondary)'];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: 4 + Math.random() * 8,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 6,
  opacity: 0.15 + Math.random() * 0.35,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
}));

export function PixelParticles() {
  return (
    <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            backgroundColor: p.color,
            opacity: p.opacity,
            borderRadius: '2px',
            animation: `pixel-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
