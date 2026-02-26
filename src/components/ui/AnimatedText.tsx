interface AnimatedTextProps {
  text: string;
  class?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delayMs?: number;
}

export function AnimatedText({
  text,
  class: className = '',
  as: Tag = 'h1',
  delayMs = 30,
}: AnimatedTextProps) {
  return (
    <Tag class={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          style={{
            display: 'inline-block',
            animation: `fade-up 0.5s ease-out ${i * delayMs}ms both`,
            whiteSpace: char === ' ' ? 'pre' : undefined,
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
}
