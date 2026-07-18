import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-lg leading-8 text-muted-foreground">{description}</p> : null}
    </div>
  );
}
