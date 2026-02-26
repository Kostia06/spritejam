export function SectionDivider() {
  return (
    <div class="flex items-center justify-center gap-2 py-4" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          class="w-1.5 h-1.5 rounded-sm"
          style={{
            backgroundColor: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}
