import { ArrowUpRight, FileSearch, Gauge, Share2 } from "lucide-react";

const steps = [
  {
    icon: FileSearch,
    title: "Fetch the real page",
    body: "We request the URL server-side and read the actual <head> you ship — no demo data, ever.",
  },
  {
    icon: Gauge,
    title: "Score every tag",
    body: "Title, description, canonical, robots, viewport, Open Graph and Twitter cards, each graded.",
  },
  {
    icon: Share2,
    title: "Preview the share",
    body: "See the Google result and social cards built from the metadata your page really contains.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border/60 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">How it works</p>
            <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
              Three steps, one honest report.
            </h2>
          </div>
          <a
            href="https://developers.google.com/search/docs/appearance/title-link"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Google's guidance
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_28px_60px_-40px_rgba(15,23,42,0.5)]"
            >
              <span className="absolute right-5 top-5 font-mono text-[11px] text-muted-foreground/60">
                0{index + 1}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform duration-500 group-hover:scale-105">
                <step.icon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-5 font-display text-[15px] font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}