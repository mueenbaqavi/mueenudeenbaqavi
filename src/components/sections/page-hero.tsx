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
    <section className={cn("border-b bg-muted/40 py-16 md:py-20", className)}>
      <div className="container">
        <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-muted-foreground md:text-xl">{description}</p>
      </div>
    </section>
  );
}
