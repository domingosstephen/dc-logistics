import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center mb-16", className)}>
      <h2 className="font-display text-3xl md:text-5xl font-semibold text-ink tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-ink/60 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
