export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg className={`ico ${className}`} aria-hidden="true" focusable="false">
      <use href={`#${name}`} />
    </svg>
  );
}
