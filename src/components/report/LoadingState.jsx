import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Resolving the address…",
  "Fetching the page HTML…",
  "Parsing meta tags…",
  "Running 17 quality checks…",
  "Building your previews…",
];

export default function LoadingState({ url }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((value) => (value + 1) % STEPS.length);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
          <div className="h-px w-1/2 animate-sweep bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <span className="relative grid h-14 w-14 place-items-center">
            <span className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
            <Loader2 className="h-5 w-5 text-primary/60" />
          </span>
          <div>
            <h2 className="font-heading text-2xl text-foreground">Analyzing website SEO…</h2>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
              Reading the real page at <span className="font-mono text-[12px] text-foreground/80">{url}</span>
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {STEPS[step]}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="h-56 animate-pulse rounded-3xl border border-border bg-card" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-border bg-card"
              style={{ animationDelay: `${index * 90}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}