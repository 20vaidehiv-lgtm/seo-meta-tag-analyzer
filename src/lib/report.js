export const STATUS_META = {
  good: {
    label: "Valid",
    dot: "bg-[hsl(var(--good))]",
    text: "text-[hsl(var(--good))]",
    chip: "bg-[hsl(var(--good-soft))] text-[hsl(var(--good))] border-transparent",
    ring: "border-[hsl(var(--good))]",
  },
  warn: {
    label: "Needs work",
    dot: "bg-[hsl(var(--warn))]",
    text: "text-[hsl(var(--warn))]",
    chip: "bg-[hsl(var(--warn-soft))] text-[hsl(var(--warn))] border-transparent",
    ring: "border-[hsl(var(--warn))]",
  },
  bad: {
    label: "Missing",
    dot: "bg-[hsl(var(--bad))]",
    text: "text-[hsl(var(--bad))]",
    chip: "bg-[hsl(var(--bad-soft))] text-[hsl(var(--bad))] border-transparent",
    ring: "border-[hsl(var(--bad))]",
  },
  neutral: {
    label: "Optional",
    dot: "bg-[hsl(var(--neutral))]",
    text: "text-[hsl(var(--neutral))]",
    chip: "bg-[hsl(var(--neutral-soft))] text-[hsl(var(--neutral))] border-transparent",
    ring: "border-[hsl(var(--neutral))]",
  },
};

export const TONE_ACCENT = {
  good: "text-[hsl(var(--good))]",
  warn: "text-[hsl(var(--warn))]",
  bad: "text-[hsl(var(--bad))]",
  neutral: "text-[hsl(var(--neutral))]",
};

export const TONE_STROKE = {
  good: "hsl(var(--good))",
  warn: "hsl(var(--warn))",
  bad: "hsl(var(--bad))",
  neutral: "hsl(var(--neutral))",
};

export function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function buildMetaText(report) {
  const { meta } = report;
  const rows = [
    `SEO Meta Tag Analysis — ${report.host}`,
    `Analyzed: ${report.finalUrl}`,
    `Score: ${report.score}/100 (${report.grade.label})`,
    "",
    "BASIC SEO",
    `Page title: ${meta.title || "(missing)"}`,
    `Meta description: ${meta.description || "(missing)"}`,
    `Meta keywords: ${meta.keywords || "(none)"}`,
    `Canonical: ${meta.canonical || "(missing)"}`,
    `Robots: ${meta.robots || "(not set)"}`,
    `Viewport: ${meta.viewport || "(missing)"}`,
    "",
    "OPEN GRAPH",
    `og:title: ${meta.og.title || "(missing)"}`,
    `og:description: ${meta.og.description || "(missing)"}`,
    `og:image: ${meta.og.image || "(missing)"}`,
    `og:url: ${meta.og.url || "(missing)"}`,
    `og:type: ${meta.og.type || "(missing)"}`,
    `og:site_name: ${meta.og.siteName || "(missing)"}`,
    "",
    "TWITTER CARD",
    `twitter:card: ${meta.twitter.card || "(missing)"}`,
    `twitter:title: ${meta.twitter.title || "(missing)"}`,
    `twitter:description: ${meta.twitter.description || "(missing)"}`,
    `twitter:image: ${meta.twitter.image || "(missing)"}`,
    "",
    "TECHNICAL",
    `HTML lang: ${meta.lang || "(missing)"}`,
    `Favicon: ${meta.favicon || "(default assumed)"}`,
    `H1 count: ${meta.h1Count}`,
  ];
  return rows.join("\n");
}