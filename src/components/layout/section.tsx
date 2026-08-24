import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 md:py-32", className)}>
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">{children}</div>
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
    <div className={cn("mb-10", className)}>
      <h2 className="font-display text-3xl font-semibold text-deep">{title}</h2>
      {subtitle && <p className="mt-3 text-steel">{subtitle}</p>}
    </div>
  );
}
