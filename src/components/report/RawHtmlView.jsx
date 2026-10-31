import { useState } from "react";
import { Code2, ChevronDown } from "lucide-react";
import CopyButton from "@/components/report/CopyButton";
import { cn } from "@/lib/utils";

export default function RawHtmlView({ html, truncated }) {
  const [open, setOpen] = useState(false);

  const lines = html.split("\n");
  const preview = lines.slice(0, 26).join("\n");

  return (
    <section id="raw" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">Source</p>
          <h2 className="mt-1.5 font-heading text-2xl text-foreground sm:text-3xl">Raw head HTML</h2>
        </div>
        <CopyButton value={html} label="Copy HTML" />
      </div>

      <div className="mt-5 min-w-0 max-w-full overflow-hidden rounded-3xl border border-border bg-[hsl(var(--surface-sunken))]">
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground">
            <Code2 className="h-3.5 w-3.5" />
            &lt;head&gt; · {lines.length} lines{truncated ? " (truncated)" : ""}
          </span>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? "Collapse" : "Expand all"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </button>
        </div>
        <pre
          className={cn(
            "overflow-auto px-4 py-3.5 font-mono text-[11.5px] leading-relaxed text-foreground/90",
            open ? "max-h-[560px]" : "max-h-[240px]"
          )}
        >
          <code>{open ? html : preview}</code>
          {!open && lines.length > 26 && (
            <span className="mt-2 block text-muted-foreground">… {lines.length - 26} more lines</span>
          )}
        </pre>
      </div>
    </section>
  );
}