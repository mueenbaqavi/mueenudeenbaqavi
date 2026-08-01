import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <section className={cn("border-b bg-muted/40 py-8 md:py-12", className)}>
      <div className="container">
        <h1 className="max-w-4xl text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}
