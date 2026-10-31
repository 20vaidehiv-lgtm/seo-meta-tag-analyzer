import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CopyButton({ value, label = "Copy", className, compact = false }) {
  const [copied, setCopied] = useState(false);

  async function copy(event) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11.5px] font-medium text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground",
        compact && "border-transparent bg-transparent px-1.5 py-1 hover:bg-muted",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[hsl(var(--good))]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {!compact && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
}