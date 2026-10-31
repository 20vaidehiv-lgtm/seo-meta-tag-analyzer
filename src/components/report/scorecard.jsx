import { Info } from "lucide-react";
import ScoreGauge from "@/components/report/ScoreGauge";
import { TONE_ACCENT } from "@/lib/report";

export default function ScoreCard({ score, grade, groups }) {
  return (
    <section
      id="score"
      className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.6)] sm:p-8"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex items-center gap-6">
          <ScoreGauge score={score} tone={grade.tone} />
          <div className="min-w-0">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
              SEO score
            </p>
            <h2 className={`mt-1.5 font-display text-xl font-semibold sm:text-[1.4rem] ${TONE_ACCENT[grade.tone]}`}>
              {grade.label}
            </h2>
            <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">{grade.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5 text-[10.5px]">
              <span className="rounded-full bg-[hsl(var(--good-soft))] px-2 py-0.5 text-[hsl(var(--good))]">80–100 Good</span>
              <span className="rounded-full bg-[hsl(var(--warn-soft))] px-2 py-0.5 text-[hsl(var(--warn))]">60–79 Improve</span>
              <span className="rounded-full bg-[hsl(var(--bad-soft))] px-2 py-0.5 text-[hsl(var(--bad))]">0–59 Poor</span>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:border-l lg:border-border/70 lg:pl-8">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
            Score breakdown
          </p>
          <div className="mt-4 space-y-3.5">
            {groups.map((group) => (
              <div key={group.key}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-medium text-foreground">{group.label}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {group.weight === 0 ? "info only" : `${group.score}%`}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      group.score >= 80
                        ? "bg-[hsl(var(--good))]"
                        : group.score >= 60
                          ? "bg-[hsl(var(--warn))]"
                          : "bg-[hsl(var(--bad))]"
                    }`}
                    style={{ width: `${group.weight === 0 ? 100 : Math.max(3, group.score)}%`, opacity: group.weight === 0 ? 0.35 : 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-start gap-2 border-t border-border/70 pt-4 text-[11.5px] leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This score is our own assessment of the tags found on the page. It is a hygiene indicator, not a prediction of Google rankings.
      </p>
    </section>
  );
}