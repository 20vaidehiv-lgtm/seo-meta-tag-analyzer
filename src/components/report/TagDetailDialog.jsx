import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lightbulb, Target, Info } from "lucide-react";
import CopyButton from "@/components/report/CopyButton";
import { STATUS_META } from "@/lib/report";

export default function TagDetailDialog({ check, open, onOpenChange }) {
  if (!check) return null;
  const meta = STATUS_META[check.status] || STATUS_META.neutral;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="font-mono text-sm font-medium text-foreground">{check.label}</DialogTitle>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium ${meta.chip}`}>
              {meta.label}
            </span>
            {check.weight > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10.5px] text-muted-foreground">
                {check.weight} pts of score
              </span>
            )}
          </div>
          <DialogDescription className="pt-1 text-xs text-muted-foreground">{check.purpose}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Extracted value
            </p>
            <div className="mt-2 rounded-xl border border-border bg-[hsl(var(--surface-sunken))] p-3">
              <p className={`break-words font-mono text-[12px] leading-relaxed ${check.value ? "text-foreground" : "italic text-muted-foreground"}`}>
                {check.value || "No value found in the page's <head>."}
              </p>
              {check.note && <p className="mt-2 text-[11px] text-muted-foreground">{check.note}</p>}
            </div>
            {check.value && (
              <div className="mt-2">
                <CopyButton value={check.value} label="Copy value" />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">Why it matters</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{check.why}</p>
            </div>
          </div>

          {check.suggestion && (
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Lightbulb className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">How to improve it</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{check.suggestion}</p>
                {check.example && (
                  <div className="relative mt-2.5 rounded-lg border border-border bg-[hsl(var(--surface-sunken))] p-3 pr-12">
                    <code className="block break-all font-mono text-[11px] leading-relaxed text-foreground">
                      {check.example}
                    </code>
                    <div className="absolute right-2 top-2">
                      <CopyButton value={check.example} compact />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {check.status === "good" && (
            <div className="flex items-center gap-2 rounded-xl bg-[hsl(var(--good-soft))] px-3 py-2.5 text-[12px] text-[hsl(var(--good))]">
              <Target className="h-3.5 w-3.5 shrink-0" />
              This tag is implemented correctly. Keep it unique and consistent on every page.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}