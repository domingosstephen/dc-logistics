// Counter component — kept for potential future use with verified statistics.
// Per brief: must NOT animate an invented statistic.
// Only use when the number is a verifiable fact supplied by the client.
export function Counter({ value, suffix = "", prefix = "", className }: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {prefix}{value.toLocaleString("pt-BR")}{suffix}
    </span>
  );
}
