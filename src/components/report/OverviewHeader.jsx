import { ExternalLink, Clock, FileCode2, Globe, ShieldCheck } from "lucide-react";
import CopyButton from "@/components/report/CopyButton";
import UrlForm from "@/components/home/UrlForm";
import { buildMetaText, formatBytes, formatTimestamp } from "@/lib/report";

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-[hsl(var(--surface-sunken))] px-3 py-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-[12.5px] font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function OverviewHeader({ report }) {
  const initial = (report.siteName || report.host).replace(/^www\./, "").charAt(0).toUpperCase();

  return (
    <section id="overview" className="scroll-mt-24 animate-rise">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.65)] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-lg font-semibold text-primary">
              {initial || "?"}
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Website overview
              </p>
              <h1 className="mt-1 truncate font-display text-xl font-semibold text-foreground sm:text-2xl">
                {report.siteName || report.host}
              </h1>
              <a
                href={report.finalUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex max-w-full items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="truncate">{report.finalUrl}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CopyButton value={buildMetaText(report)} label="Copy all metadata" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat icon={ShieldCheck} label="HTTP status" value={`${report.statusCode} OK`} />
          <Stat icon={Clock} label="Response" value={`${report.elapsedMs} ms`} />
          <Stat icon={FileCode2} label="HTML size" value={formatBytes(report.bytes)} />
          <Stat icon={Globe} label="Analyzed" value={formatTimestamp(report.analyzedAt)} />
        </div>

        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="mb-2 text-[11px] text-muted-foreground">Analyze another page</p>
          <UrlForm initialValue={report.finalUrl} size="sm" />
        </div>
      </div>
    </section>
  );
}