export function normalizeUrl(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return { ok: false, error: "Enter a website URL to analyze." };

  const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { ok: false, error: "That doesn't look like a valid URL. Try https://example.com" };
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    return { ok: false, error: "Only http:// and https:// addresses can be analyzed." };
  }
  if (!parsed.hostname.includes(".") || parsed.hostname.endsWith(".")) {
    return { ok: false, error: "Include a full domain, such as example.com" };
  }

  return { ok: true, url: parsed.toString() };
}

export function prettyHost(host) {
  if (!host) return "";
  return host.replace(/^www\./i, "");
}