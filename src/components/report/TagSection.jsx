import { useMemo, useState } from "react";
import TagCard from "@/components/report/TagCard";
import TagDetailDialog from "@/components/report/TagDetailDialog";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All tags" },
  { key: "basic", label: "Basic SEO" },
  { key: "open_graph", label: "Open Graph" },
  { key: "twitter", label: "Twitter Card" },
  { key: "technical", label: "Technical" },
];

export default function TagSection({ checks }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const visible = useMemo(
    () => (filter === "all" ? checks : checks.filter((check) => check.group === filter)),
    [checks, filter]
  );

  const issues = checks.filter((check) => check.status === "bad" || check.status === "warn").length;

  return (
    <section id="tags" className="scroll-mt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">Meta tag analysis</p>
          <h2 className="mt-1.5 font-heading text-2xl text-foreground sm:text-3xl">
            Every tag, graded
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {checks.length} checks · {issues} need attention · tap any card for the full explanation.
          </p>
        </div>
      </div>

      <div className="no-scrollbar mt-5 flex w-full max-w-full min-w-0 gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((item) => {
          const count =
            item.key === "all" ? checks.length : checks.filter((check) => check.group === item.key).length;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200",
                filter === item.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {item.label}
              <span className={cn("ml-1.5 font-mono text-[10px]", filter === item.key ? "opacity-70" : "opacity-50")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((check) => (
          <TagCard key={check.key} check={check} onOpen={setSelected} />
        ))}
      </div>

      <TagDetailDialog
        check={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </section>
  );
}