import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StatusPage({
  badge = "In Progress",
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Go Home",
  secondaryHref,
  secondaryLabel,
}) {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-16 dark:bg-[linear-gradient(180deg,#0b1120_0%,#111827_100%)]">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border bg-white/90 px-8 py-14 text-center shadow-sm backdrop-blur dark:bg-slate-950/80">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Clock3 className="h-6 w-6" />
        </div>

        <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {badge}
        </span>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="cursor-pointer">
            <Link href={primaryHref}>
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {secondaryHref && secondaryLabel ? (
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
