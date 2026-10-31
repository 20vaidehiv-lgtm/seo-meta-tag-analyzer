import { Sparkles } from "lucide-react";
import UrlForm from "@/components/home/UrlForm";

const sampleTags = [
  { label: "title", value: "Present", tone: "good" },
  { label: "description", value: "Present", tone: "good" },
  { label: "og:image", value: "Missing", tone: "bad" },
  { label: "twitter:card", value: "Needs work", tone: "warn" },
];

const toneClass = {
  good: "bg-[hsl(var(--good-soft))] text-[hsl(var(--good))]",
  warn: "bg-[hsl(var(--warn-soft))] text-[hsl(var(--warn))]",
  bad: "bg-[hsl(var(--bad-soft))] text-[hsl(var(--bad))]",
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-paper opacity-70" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              SEO Meta Tag Analyzer
            </span>

            <h1 className="mt-6 font-heading text-[2.6rem] leading-[1.04] text-foreground sm:text-6xl">
              Analyze Your
              <br />
              Website's <span className="italic text-primary">SEO</span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Discover missing meta tags, improve your SEO implementation, and preview how your website
              appears across search engines and social media.
            </p>

            <div className="mt-8 max-w-xl">
              <UrlForm />
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border/70 pt-6">
              {[
                ["20+", "tags checked"],
                ["100", "point score"],
                ["4", "live previews"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-xl font-semibold text-foreground">{value}</dt>
                  <dd className="mt-0.5 text-[11.5px] uppercase tracking-[0.1em] text-muted-foreground">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-rise [animation-delay:120ms]">
            <div className="relative mx-auto max-w-md">
              <div className="absolute inset-x-6 -bottom-4 h-24 rounded-2xl bg-card/60 blur-xl" />
              <div className="relative rounded-3xl border border-border bg-card p-6 shadow-[0_40px_90px_-50px_rgba(15,23,42,0.55)]">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    Example report
                  </p>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                    Sample data
                  </span>
                </div>

                <div className="mt-6 flex items-end gap-4">
                  <div className="relative grid h-24 w-24 place-items-center">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="9" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="hsl(var(--good))"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray="264"
                        strokeDashoffset="47"
                      />
                    </svg>
                    <span className="font-display text-2xl font-semibold text-foreground">82</span>
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-foreground">Good implementation</p>
                    <p className="mt-1 text-xs text-muted-foreground">2 fixes would lift it to 96</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {sampleTags.map((tag) => (
                    <div
                      key={tag.label}
                      className="flex items-center justify-between rounded-xl border border-border/70 bg-[hsl(var(--surface-sunken))] px-3 py-2"
                    >
                      <span className="font-mono text-[11.5px] text-foreground">{tag.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${toneClass[tag.tone]}`}>
                        {tag.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}