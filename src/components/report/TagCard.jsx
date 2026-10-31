import { CircleAlert, CircleCheck, CircleMinus, CircleX, ChevronRight } from "lucide-react";
import CopyButton from "@/components/report/CopyButton";
import { STATUS_META } from "@/lib/report";

const ICONS = {
  good: CircleCheck,
  warn: CircleAlert,
  bad: CircleX,
  neutral: CircleMinus,
};

export default function TagCard({ check, onOpen }) {
  const meta = STATUS_META[check.status] || STATUS_META.neutral;
  const Icon = ICONS[check.status] || CircleMinus;

  return (
    <div className="group relative flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_22px_45px_-38px_rgba(15,23,42,0.55)]">
      <button
        type="button"
        onClick={() => onOpen(check)}
        className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`View details for ${check.label}`}
      />

      <div className="relative z-10 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-[11.5px] font-medium text-foreground">{check.label}</p>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${meta.chip}`}>
            <Icon className="h-3 w-3" />
            {meta.label}
          </span>
        </div>

        <p
          className={`mt-2.5 line-clamp-2 min-h-[2.2rem] text-[12.5px] leading-relaxed ${
            check.value ? "text-muted-foreground" : "italic text-muted-foreground/70"
          }`}
        >
          {check.value || "Not found on this page"}
        </p>

        {check.note && (
          <p className="mt-1.5 line-clamp-1 text-[10.5px] text-muted-foreground/80">{check.note}</p>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-border/60 pt-2.5">
        <span className="pointer-events-none inline-flex items-center gap-1 text-[10.5px] text-muted-foreground/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Details
          <ChevronRight className="h-3 w-3" />
        </span>
        {check.value ? <CopyButton value={check.value} compact className="relative z-20" /> : <span />}
      </div>
    </div>
  );
}