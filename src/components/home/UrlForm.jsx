import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Link2, Loader2 } from "lucide-react";
import { normalizeUrl } from "@/lib/url";

export default function UrlForm({ initialValue = "", size = "lg" }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function submit(event) {
    event.preventDefault();
    const normalized = normalizeUrl(value);
    if (!normalized.ok) {
      setError(normalized.error);
      return;
    }
    setError("");
    setBusy(true);
    navigate({ to: "/analyze", search: { url: normalized.url } }).finally(() => setBusy(false));
  }

  const big = size === "lg";

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`group flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.35)] transition-shadow duration-300 focus-within:border-primary/50 focus-within:shadow-[0_24px_60px_-30px_hsl(var(--primary)/0.45)] sm:flex-row sm:items-center ${
          big ? "" : "sm:rounded-xl"
        }`}
      >
        <div className="flex flex-1 items-center gap-2.5 px-3">
          <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError("");
            }}
            placeholder="https://example.com"
            inputMode="url"
            autoComplete="url"
            aria-label="Website URL"
            className={`w-full bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none ${
              big ? "py-3 text-[15px]" : "py-2.5 text-sm"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary font-medium text-primary-foreground transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:opacity-70 ${
            big ? "px-6 py-3.5 text-sm" : "px-4 py-2.5 text-sm"
          }`}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Analyze site
          {!busy && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-focus-within:translate-x-0.5" />}
        </button>
      </div>
      {error ? (
        <p className="mt-2 pl-1 text-xs font-medium text-destructive animate-fade-in">{error}</p>
      ) : (
        <p className={`mt-2 pl-1 text-xs text-muted-foreground ${big ? "" : "hidden sm:block"}`}>
          Works with any publicly accessible page. Try https://example.com
        </p>
      )}
    </form>
  );
}