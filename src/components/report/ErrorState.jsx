import { AlertTriangle, ArrowRight, RefreshCw, ShieldAlert, WifiOff } from "lucide-react";

const ICON_BY_CODE = {
  blocked: ShieldAlert,
  blocked_target: ShieldAlert,
  timeout: WifiOff,
  network: WifiOff,
  rate_limited: RefreshCw,
  invalid: AlertTriangle,
  empty: AlertTriangle,
  not_found: AlertTriangle,
  http_error: AlertTriangle,
  server_error: AlertTriangle,
  not_html: AlertTriangle,
  empty_body: AlertTriangle,
  unexpected: AlertTriangle,
};

export default function ErrorState({ error, url, onRetry }) {
  const Icon = ICON_BY_CODE[error?.code] || AlertTriangle;

  return (
    <div className="mx-auto max-w-xl animate-rise py-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--bad-soft))] text-[hsl(var(--bad))]">
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="mt-5 font-heading text-2xl text-foreground">
        {error?.message || "We couldn't analyze that page."}
      </h2>
      {url && (
        <p className="mt-1.5 break-all font-mono text-[11.5px] text-muted-foreground">{url}</p>
      )}
      {error?.hint && (
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{error.hint}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
        <a
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
        >
          See a page that works
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="mx-auto mt-6 max-w-sm text-[11.5px] leading-relaxed text-muted-foreground">
        Some sites block automated requests or render entirely with JavaScript. Pages behind a login can't be analyzed.
      </p>
    </div>
  );
}