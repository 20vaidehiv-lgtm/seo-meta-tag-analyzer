/**
 * Server-only SEO analyzer: validates the target, fetches the page, extracts
 * meta data from the real HTML and scores the implementation.
 */

const TIMEOUT_MS = 13000;
const MAX_BYTES = 2_500_000;
const MAX_REDIRECTS = 5;

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  laquo: "«",
  raquo: "»",
  copy: "©",
  reg: "®",
  trade: "™",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

function decodeEntities(input = "") {
  return String(input)
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch {
        return match;
      }
    })
    .replace(/&#(\d+);/g, (match, dec) => {
      try {
        return String.fromCodePoint(parseInt(dec, 10));
      } catch {
        return match;
      }
    })
    .replace(/&([a-zA-Z]+);/g, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

function clean(value) {
  if (value == null) return "";
  return decodeEntities(value).replace(/\s+/g, " ").trim();
}

/* ------------------------------- validation ------------------------------- */

const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^localhost\./i,
  /\.localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /\.intranet$/i,
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^\[?::1\]?$/,
  /^\[?::$/,
  /^\[?f[cd][0-9a-f]{2}:/i,
  /^\[?fe80:/i,
  /^metadata\./i,
];

function assertSafeTarget(rawUrl) {
  const trimmed = String(rawUrl || "").trim();
  if (!trimmed) throw new AnalysisError("empty", "Enter a website URL to analyze.");

  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new AnalysisError("invalid", "That doesn't look like a valid URL. Try https://example.com");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new AnalysisError("invalid", "Only http:// and https:// addresses can be analyzed.");
  }
  if (parsed.username || parsed.password) {
    throw new AnalysisError("invalid", "URLs containing credentials can't be analyzed.");
  }
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    throw new AnalysisError("invalid", "Only standard web ports (80 and 443) can be analyzed.");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!hostname || !hostname.includes(".") || hostname.endsWith(".")) {
    throw new AnalysisError("invalid", "Include a full domain, such as example.com");
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.startsWith("[")) {
    throw new AnalysisError("blocked_target", "Direct IP addresses can't be analyzed. Use the site's domain name.");
  }
  if (BLOCKED_PATTERNS.some((pattern) => pattern.test(hostname))) {
    throw new AnalysisError("blocked_target", "Private and internal addresses can't be analyzed.");
  }

  return parsed;
}

class AnalysisError extends Error {
  constructor(code, message, hint) {
    super(message);
    this.code = code;
    this.hint = hint;
  }
}

/* --------------------------------- fetching -------------------------------- */

async function readCapped(response) {
  const reader = response.body?.getReader();
  if (!reader) return await response.text();

  const decoder = new TextDecoder("utf-8");
  let received = 0;
  let output = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    output += decoder.decode(value, { stream: true });
    if (received >= MAX_BYTES) {
      await reader.cancel().catch(() => {});
      break;
    }
  }
  output += decoder.decode();
  return output;
}

async function fetchDocument(target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("timeout")), TIMEOUT_MS);
  const started = Date.now();

  try {
    const response = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 MetaLens/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
    });

    const elapsed = Date.now() - started;

    if (response.url) {
      try {
        assertSafeTarget(response.url);
      } catch {
        throw new AnalysisError("blocked_target", "That address redirects to a private network location.");
      }
    }

    if (!response.ok) {
      throw httpError(response.status);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType && !/html|xml|text\/plain/i.test(contentType)) {
      throw new AnalysisError(
        "not_html",
        "That address didn't return an HTML page.",
        "Check that the URL points to a webpage rather than a file or API endpoint."
      );
    }

    const html = await readCapped(response);

    if (!html || !/<[a-z!]/i.test(html)) {
      throw new AnalysisError(
        "empty_body",
        "The page returned no readable HTML.",
        "The site may render entirely with JavaScript, which this tool can't execute."
      );
    }

    return {
      html,
      finalUrl: response.url || target.toString(),
      statusCode: response.status,
      elapsedMs: elapsed,
      bytes: new TextEncoder().encode(html).byteLength,
    };
  } catch (error) {
    if (error instanceof AnalysisError) throw error;
    if (error?.name === "AbortError" || /timeout/i.test(error?.message || "")) {
      throw new AnalysisError(
        "timeout",
        "The website took too long to respond.",
        "Try again, or check that the site is online and reachable."
      );
    }
    throw new AnalysisError(
      "network",
      "We couldn't reach that website.",
      "Check the URL and try again. Some sites block automated requests."
    );
  } finally {
    clearTimeout(timer);
  }
}

function httpError(status) {
  if (status === 401 || status === 403) {
    return new AnalysisError(
      "blocked",
      "This website blocked the request.",
      "Some sites refuse automated access. Try a different page on the same site, or analyze a site that allows it."
    );
  }
  if (status === 404) {
    return new AnalysisError("not_found", "That page doesn't exist (404).", "Double-check the URL.");
  }
  if (status === 429) {
    return new AnalysisError(
      "rate_limited",
      "The website is rate limiting requests.",
      "Wait a moment and try again."
    );
  }
  if (status >= 500) {
    return new AnalysisError(
      "server_error",
      `The website returned a server error (${status}).`,
      "The site may be down. Try again later."
    );
  }
  return new AnalysisError(
    "http_error",
    `The website responded with status ${status}.`,
    "Only pages that load normally can be analyzed."
  );
}

/* --------------------------------- parsing --------------------------------- */

const ATTR_RE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+))/g;

function parseAttributes(tagText) {
  const attributes = {};
  ATTR_RE.lastIndex = 0;
  let match;
  while ((match = ATTR_RE.exec(tagText))) {
    const key = match[1].toLowerCase();
    if (!(key in attributes)) {
      attributes[key] = clean(match[2] ?? match[3] ?? match[4] ?? "");
    }
  }
  return attributes;
}

function extractMetaTags(html) {
  const map = new Map();
  const metaRe = /<meta\b[^>]*>/gi;
  let match;
  while ((match = metaRe.exec(html))) {
    const attrs = parseAttributes(match[0]);
    const key = (attrs.property || attrs.name || attrs.itemprop || "").toLowerCase();
    if (!key) continue;
    const content = attrs.content ?? "";
    if (!map.has(key)) map.set(key, content);
    else if (!map.get(key) && content) map.set(key, content);
  }
  return map;
}

function extractLinks(html) {
  const links = [];
  const linkRe = /<link\b[^>]*>/gi;
  let match;
  while ((match = linkRe.exec(html))) {
    const attrs = parseAttributes(match[0]);
    if (attrs.rel || attrs.href) links.push(attrs);
  }
  return links;
}

function firstMatch(html, re) {
  const match = html.match(re);
  return match ? match[1] : "";
}

function resolveUrl(value, base) {
  if (!value) return "";
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

function extractFacts(html, baseUrl) {
  const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const headHtml = headMatch ? headMatch[0] : html.slice(0, 120000);
  const meta = extractMetaTags(headHtml + (headMatch ? "" : ""));
  const links = extractLinks(headHtml);

  const get = (...keys) => {
    for (const key of keys) {
      const value = meta.get(key);
      if (value) return value;
    }
    return "";
  };

  const titleRaw = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const htmlTag = firstMatch(html, /<html\b([^>]*)>/i);
  const lang = parseAttributes(`<html ${htmlTag}>`).lang || "";

  const iconLink =
    links.find((link) => /(^|\s)icon(\s|$)/i.test(link.rel || "") && link.href) ||
    links.find((link) => /apple-touch-icon/i.test(link.rel || "") && link.href);

  const canonicalLink = links.find((link) => /(^|\s)canonical(\s|$)/i.test(link.rel || ""));

  const h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length;

  return {
    headHtml,
    canonical: canonicalLink ? canonicalLink.href : "",
    favicon: iconLink ? resolveUrl(iconLink.href, baseUrl) : "",
    lang,
    h1Count,
    raw: {
      title: clean(titleRaw),
      description: get("description"),
      keywords: get("keywords"),
      robots: get("robots", "googlebot"),
      viewport: get("viewport"),
      charset: meta.get("charset") || (headHtml.match(/charset=["']?([\w-]+)/i) || [])[1] || "",
      ogTitle: get("og:title"),
      ogDescription: get("og:description"),
      ogImage: get("og:image", "og:image:url", "og:image:secure_url"),
      ogUrl: get("og:url"),
      ogType: get("og:type"),
      ogSiteName: get("og:site_name"),
      twitterCard: get("twitter:card"),
      twitterTitle: get("twitter:title"),
      twitterDescription: get("twitter:description"),
      twitterImage: get("twitter:image", "twitter:image:src"),
    },
  };
}

/* -------------------------------- analysis --------------------------------- */

const PURPOSES = {
  title: "The clickable headline in search results and browser tabs.",
  description: "The snippet under the title that persuades searchers to click.",
  keywords: "A legacy list of keywords. Modern search engines ignore it.",
  canonical: "Tells search engines which URL is the authoritative version of the page.",
  robots: "Controls whether crawlers may index the page and follow its links.",
  viewport: "Makes the page render correctly on phones and tablets.",
  ogTitle: "The headline shown when the page is shared on social platforms.",
  ogDescription: "The summary shown beneath the headline in social cards.",
  ogImage: "The large image shown in social share cards.",
  ogUrl: "The canonical address social platforms attribute the share to.",
  ogType: "Describes the kind of content, such as website or article.",
  ogSiteName: "The site name shown above the social card title.",
  twitterCard: "Selects the layout of an X/Twitter card.",
  twitterTitle: "The headline used on X/Twitter cards.",
  twitterDescription: "The summary used on X/Twitter cards.",
  twitterImage: "The image used on X/Twitter cards.",
  favicon: "The small icon shown beside the search result and in browser tabs.",
  lang: "Declares the page's language for search engines and screen readers.",
  h1: "The page's primary heading, which reinforces the topic for crawlers.",
};

const GROUP_LABEL = {
  basic: "Basic SEO",
  open_graph: "Open Graph",
  twitter: "Twitter Card",
  technical: "Technical",
};

function buildChecks(facts, baseUrl) {
  const { raw } = facts;
  const checks = [];

  function add(key, group, weight, status, ratio, extra = {}) {
    checks.push({
      key,
      label: extra.label || key,
      group,
      weight,
      status,
      ratio,
      value: extra.value ?? "",
      note: extra.note || "",
      purpose: extra.purpose || PURPOSES[key] || "",
      why: extra.why || "",
      suggestion: extra.suggestion || "",
      example: extra.example || "",
    });
  }

  /* title */
  const titleLen = raw.title.length;
  if (!titleLen) {
    add("title", "basic", 17, "bad", 0, {
      label: "Page title",
      why: "Without a title, search engines invent one from page content — often a poor, truncated choice.",
      suggestion: "Add a unique, descriptive <title> of 30–60 characters.",
      example: "<title>SEO Meta Tag Analyzer — Audit Any Website in Seconds</title>",
      note: "Tag not found",
      purpose: PURPOSES.title,
    });
  } else {
    const good = titleLen >= 30 && titleLen <= 60;
    const ratio = good ? 1 : titleLen < 15 ? 0.4 : titleLen < 30 ? 0.75 : titleLen <= 70 ? 0.75 : 0.5;
    add("title", "basic", 17, good ? "good" : "warn", ratio, {
      label: "Page title",
      value: raw.title,
      note: `${titleLen} characters${titleLen > 60 ? " — may be truncated in results" : titleLen < 30 ? " — a little short" : ""}`,
      why: "This is the headline people see in search results, so its wording directly affects click-through.",
      suggestion: good
        ? "Keep it unique per page and front-load the topic."
        : "Aim for 30–60 characters with the primary keyword near the start.",
      example: "<title>SEO Meta Tag Analyzer — Audit Any Website in Seconds</title>",
    });
  }

  /* description */
  const descLen = raw.description.length;
  if (!descLen) {
    add("description", "basic", 14, "bad", 0, {
      label: "Meta description",
      why: "Without one, search engines assemble a snippet from the page, which is often less persuasive.",
      suggestion: "Write a 120–160 character summary that includes the page's value and a light call to action.",
      example:
        '<meta name="description" content="Analyze any website\'s meta tags, score its SEO implementation out of 100 and preview Google and social results." />',
      note: "Tag not found",
    });
  } else {
    const good = descLen >= 70 && descLen <= 160;
    const ratio = good ? 1 : descLen < 40 ? 0.4 : descLen < 70 ? 0.7 : descLen <= 200 ? 0.7 : 0.45;
    add("description", "basic", 14, good ? "good" : "warn", ratio, {
      label: "Meta description",
      value: raw.description,
      note: `${descLen} characters${descLen > 160 ? " — likely truncated" : descLen < 70 ? " — a little short" : ""}`,
      why: "The description is your ad copy in the results page; a compelling one lifts click-through rate.",
      suggestion: good
        ? "Keep it unique per page and aligned with the page's actual promise."
        : "Aim for 120–160 characters, written as a benefit-led sentence.",
      example:
        '<meta name="description" content="Analyze any website\'s meta tags, score its SEO implementation out of 100 and preview Google and social results." />',
    });
  }

  /* keywords */
  add("keywords", "basic", 0, raw.keywords ? "neutral" : "neutral", 1, {
    label: "Meta keywords",
    value: raw.keywords,
    note: raw.keywords ? "Present — search engines ignore this tag" : "Not present — that's fine",
    why: "Google has not used meta keywords for ranking since 2009; other engines barely use them.",
    suggestion: "You can safely omit it. Spend the effort on title, description and content instead.",
    purpose: PURPOSES.keywords,
  });

  /* canonical */
  const canonicalResolved = facts.canonical ? resolveUrl(facts.canonical, baseUrl) : "";
  if (!facts.canonical) {
    add("canonical", "basic", 7, "bad", 0, {
      label: "Canonical URL",
      why: "Without a canonical, duplicate versions of a page (tracking parameters, http/https, www) can split ranking signals.",
      suggestion: "Add a self-referencing canonical link pointing at the preferred absolute URL.",
      example: '<link rel="canonical" href="https://example.com/page" />',
      note: "Tag not found",
    });
  } else {
    const absolute = /^https?:\/\//i.test(facts.canonical);
    add("canonical", "basic", 7, absolute ? "good" : "warn", absolute ? 1 : 0.7, {
      label: "Canonical URL",
      value: facts.canonical,
      note: absolute ? canonicalResolved : "Relative URL — use an absolute address",
      why: "A canonical consolidates ranking signals onto one URL so duplicates don't compete.",
      suggestion: absolute
        ? "Make sure it matches the URL you want indexed and stays consistent across pages."
        : "Use a full absolute URL, including protocol and domain.",
      example: '<link rel="canonical" href="https://example.com/page" />',
    });
  }

  /* robots */
  const robotsValue = raw.robots.toLowerCase();
  const blocksIndexing = /noindex|none/.test(robotsValue);
  if (!raw.robots) {
    add("robots", "basic", 5, "warn", 0.6, {
      label: "Robots meta",
      value: "",
      note: "Not set — defaults to index, follow",
      why: "The default already allows indexing, so this is optional, but being explicit avoids accidental blocks.",
      suggestion: 'Optionally add <meta name="robots" content="index, follow" /> on pages you want indexed.',
      example: '<meta name="robots" content="index, follow" />',
    });
  } else {
    add("robots", "basic", 5, blocksIndexing ? "warn" : "good", blocksIndexing ? 0.5 : 1, {
      label: "Robots meta",
      value: raw.robots,
      note: blocksIndexing ? "This page is told not to be indexed" : "Indexing allowed",
      why: "Robots directives decide whether the page can appear in search results at all.",
      suggestion: blocksIndexing
        ? "If this page should rank, replace noindex with index, follow."
        : "Leave as is — it clearly permits indexing.",
      example: '<meta name="robots" content="index, follow" />',
    });
  }

  /* viewport */
  const viewportValue = raw.viewport.toLowerCase();
  if (!raw.viewport) {
    add("viewport", "basic", 6, "bad", 0, {
      label: "Viewport meta",
      why: "Mobile-first indexing means a missing viewport makes the page render zoomed-out and cramped on phones.",
      suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1" />.',
      example: '<meta name="viewport" content="width=device-width, initial-scale=1" />',
      note: "Tag not found",
    });
  } else {
    const responsive = /width\s*=\s*device-width/.test(viewportValue);
    add("viewport", "basic", 6, responsive ? "good" : "warn", responsive ? 1 : 0.6, {
      label: "Viewport meta",
      value: raw.viewport,
      note: responsive ? "Responsive configuration" : "Missing width=device-width",
      why: "A correct viewport is the foundation of a usable mobile experience, which search engines weigh heavily.",
      suggestion: responsive
        ? "Keep it consistent on every page."
        : 'Include width=device-width, initial-scale=1 in the viewport content.',
      example: '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    });
  }

  /* open graph */
  add("ogTitle", "open_graph", 5, raw.ogTitle ? "good" : "bad", raw.ogTitle ? 1 : 0, {
    label: "og:title",
    value: raw.ogTitle,
    note: raw.ogTitle ? "" : "Tag not found",
    why: "Platforms show this headline in the share card; without it they may pick an unrelated heading.",
    suggestion: "Add an og:title that reads well out of context in a feed.",
    example: '<meta property="og:title" content="SEO Meta Tag Analyzer" />',
  });

  add("ogDescription", "open_graph", 5, raw.ogDescription ? "good" : "bad", raw.ogDescription ? 1 : 0, {
    label: "og:description",
    value: raw.ogDescription,
    note: raw.ogDescription ? `${raw.ogDescription.length} characters` : "Tag not found",
    why: "This is the summary under the headline on Facebook, LinkedIn and most chat apps.",
    suggestion: "Write 1–2 sentences (about 125–200 characters) that stand alone outside your site.",
    example: '<meta property="og:description" content="Audit any page\'s meta tags and preview its social cards." />',
  });

  const ogImageAbsolute = raw.ogImage ? /^https?:\/\//i.test(resolveUrl(raw.ogImage, baseUrl)) : false;
  add(
    "ogImage",
    "open_graph",
    8,
    !raw.ogImage ? "bad" : ogImageAbsolute ? "good" : "warn",
    !raw.ogImage ? 0 : ogImageAbsolute ? 1 : 0.6,
    {
      label: "og:image",
      value: raw.ogImage ? resolveUrl(raw.ogImage, baseUrl) : "",
      note: raw.ogImage ? "Use 1200 × 630 px for wide cards" : "Tag not found — shares show no image",
      why: "Posts with an image earn noticeably more engagement, and platforms often refuse to render text-only cards.",
      suggestion: "Add an absolute og:image URL at 1200 × 630 px with a safe-zone-aware composition.",
      example: '<meta property="og:image" content="https://example.com/og.jpg" />',
    }
  );

  add("ogUrl", "open_graph", 3, raw.ogUrl ? "good" : "warn", raw.ogUrl ? 1 : 0.4, {
    label: "og:url",
    value: raw.ogUrl ? resolveUrl(raw.ogUrl, baseUrl) : "",
    note: raw.ogUrl ? "" : "Tag not found",
    why: "It tells platforms the canonical address of the shared page, preventing split engagement.",
    suggestion: "Set og:url to the canonical absolute URL of the page.",
    example: '<meta property="og:url" content="https://example.com/page" />',
  });

  add("ogType", "open_graph", 3, raw.ogType ? "good" : "warn", raw.ogType ? 1 : 0.4, {
    label: "og:type",
    value: raw.ogType,
    note: raw.ogType ? "" : "Tag not found",
    why: "The type tells platforms whether this is a website, article, product and so on.",
    suggestion: "Use website for landing pages and article for posts.",
    example: '<meta property="og:type" content="website" />',
  });

  /* twitter */
  const validCards = ["summary", "summary_large_image", "player", "app"];
  if (!raw.twitterCard) {
    add("twitterCard", "twitter", 5, "bad", 0, {
      label: "twitter:card",
      value: "",
      note: "Tag not found",
      why: "Without a card type, X may render a bare link instead of a rich preview.",
      suggestion: "Add twitter:card, usually summary_large_image for pages with a hero image.",
      example: '<meta name="twitter:card" content="summary_large_image" />',
    });
  } else {
    const valid = validCards.includes(raw.twitterCard.toLowerCase());
    add("twitterCard", "twitter", 5, valid ? "good" : "warn", valid ? 1 : 0.5, {
      label: "twitter:card",
      value: raw.twitterCard,
      note: valid ? "" : "Unrecognised card type",
      why: "It selects the layout X uses for the shared link.",
      suggestion: valid ? "" : "Use summary, summary_large_image, player or app.",
      example: '<meta name="twitter:card" content="summary_large_image" />',
    });
  }

  const twitterFallbacks = [
    ["twitterTitle", "twitter:title", raw.twitterTitle, raw.ogTitle, "headline", 4],
    ["twitterDescription", "twitter:description", raw.twitterDescription, raw.ogDescription, "summary", 3],
    [
      "twitterImage",
      "twitter:image",
      raw.twitterImage || raw.ogImage,
      raw.ogImage,
      "image",
      5,
    ],
  ];

  for (const [key, label, value, fallback, noun, weight] of twitterFallbacks) {
    const explicit = key === "twitterImage" ? raw.twitterImage : value;
    if (explicit) {
      add(key, "twitter", weight, "good", 1, {
        label,
        value: key === "twitterImage" ? resolveUrl(explicit, baseUrl) : explicit,
        note: "",
        why: `X uses this ${noun} on the card; without it the card relies on other tags.`,
        suggestion: `Keep ${label} consistent with your Open Graph ${noun}.`,
        example: `<meta name="${label}" content="..." />`,
      });
    } else if (fallback) {
      add(key, "twitter", weight, "neutral", 0.75, {
        label,
        value: "",
        note: "Missing — X will fall back to the Open Graph equivalent",
        why: `Cards still render because X falls back to og:${noun === "summary" ? "description" : noun === "headline" ? "title" : "image"}.`,
        suggestion: `Optionally add ${label} to control this ${noun} independently.`,
        example: `<meta name="${label}" content="..." />`,
      });
    } else {
      add(key, "twitter", weight, "bad", 0, {
        label,
        value: "",
        note: "Tag not found and no Open Graph fallback",
        why: `X cards will show no ${noun}, which makes the post look unfinished.`,
        suggestion: `Add ${label} (or its Open Graph equivalent).`,
        example: `<meta name="${label}" content="..." />`,
      });
    }
  }

  /* technical */
  add("favicon", "technical", 3, facts.favicon ? "good" : "warn", facts.favicon ? 1 : 0.5, {
    label: "Favicon",
    value: facts.favicon || "/favicon.ico (assumed default)",
    note: facts.favicon ? "" : "No icon link found — the default /favicon.ico is assumed",
    why: "The favicon appears beside your result and helps people recognise the site among competitors.",
    suggestion: "Declare an icon explicitly so every browser and platform finds it.",
    example: '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
  });

  add("lang", "technical", 4, facts.lang ? "good" : "bad", facts.lang ? 1 : 0, {
    label: "HTML lang",
    value: facts.lang,
    note: facts.lang ? "" : "No lang attribute on <html>",
    why: "Language declares help search engines serve the right audience and assist screen readers.",
    suggestion: 'Set the language on the root element, e.g. <html lang="en">.',
    example: '<html lang="en">',
    purpose: PURPOSES.lang,
  });

  const h1Status = facts.h1Count === 1 ? "good" : facts.h1Count === 0 ? "bad" : "warn";
  add("h1", "technical", 3, h1Status, facts.h1Count === 1 ? 1 : facts.h1Count === 0 ? 0 : 0.6, {
    label: "H1 heading",
    value: facts.h1Count ? `${facts.h1Count} H1 element${facts.h1Count > 1 ? "s" : ""} found` : "",
    note: facts.h1Count === 0 ? "No H1 on the page" : facts.h1Count > 1 ? "More than one H1 dilutes the topic" : "",
    why: "A single H1 gives crawlers a clear topical signal that supports the title.",
    suggestion: "Use exactly one H1 per page that mirrors the page's main topic.",
    example: "<h1>Audit your page's metadata</h1>",
    purpose: PURPOSES.h1,
  });

  return checks;
}

function gradeFor(score) {
  if (score >= 80) return { label: "Good SEO implementation", tone: "good", summary: "Metadata is in solid shape — polish the remaining details." };
  if (score >= 60)
    return { label: "Needs improvement", tone: "warn", summary: "The essentials exist but several gaps are costing you visibility." };
  return { label: "Poor implementation", tone: "bad", summary: "Key metadata is missing, so search and social results suffer." };
}

function buildRecommendations(checks) {
  return checks
    .filter((check) => check.weight > 0 && check.ratio < 0.9)
    .map((check) => ({
      key: check.key,
      title: recommendationTitle(check),
      severity: check.weight >= 7 || check.status === "bad" ? "high" : check.status === "warn" ? "medium" : "low",
      impact: Math.round(check.weight * (1 - check.ratio)),
      what: check.status === "bad" ? `${check.label} is missing or unusable.` : `${check.label} needs work.`,
      why: check.why,
      how: check.suggestion,
      example: check.example,
      group: check.group,
    }))
    .sort((a, b) => b.impact - a.impact || a.title.localeCompare(b.title))
    .slice(0, 9);
}

function recommendationTitle(check) {
  const map = {
    title: "Title tag",
    description: "Meta description",
    canonical: "Canonical URL",
    robots: "Robots directive",
    viewport: "Mobile viewport",
    ogTitle: "Open Graph title",
    ogDescription: "Open Graph description",
    ogImage: "Open Graph image",
    ogUrl: "Open Graph URL",
    ogType: "Open Graph type",
    twitterCard: "Twitter card type",
    twitterTitle: "Twitter title",
    twitterDescription: "Twitter description",
    twitterImage: "Twitter image",
    favicon: "Favicon",
    lang: "Page language",
    h1: "H1 heading",
  };
  return map[check.key] || check.label;
}

function summariseGroups(checks) {
  return ["basic", "open_graph", "twitter", "technical"].map((group) => {
    const groupChecks = checks.filter((check) => check.group === group);
    const weight = groupChecks.reduce((total, check) => total + check.weight, 0);
    const earned = groupChecks.reduce((total, check) => total + check.weight * check.ratio, 0);
    return {
      key: group,
      label: GROUP_LABEL[group],
      weight,
      score: weight ? Math.round((earned / weight) * 100) : 100,
      passed: groupChecks.filter((check) => check.status === "good").length,
      total: groupChecks.length,
    };
  });
}

/* ------------------------------- entry point ------------------------------- */

export async function analyzeSiteUrl(rawUrl) {
  try {
    const target = assertSafeTarget(rawUrl);
    const doc = await fetchDocument(target);
    const facts = extractFacts(doc.html, doc.finalUrl);

    const checks = buildChecks(facts, doc.finalUrl);
    const score = Math.max(
      0,
      Math.min(100, Math.round(checks.reduce((total, check) => total + check.weight * check.ratio, 0)))
    );
    const grade = gradeFor(score);
    const finalUrl = doc.finalUrl;

    const meta = {
      title: facts.raw.title,
      description: facts.raw.description,
      keywords: facts.raw.keywords,
      canonical: facts.canonical || "",
      robots: facts.raw.robots,
      viewport: facts.raw.viewport,
      charset: facts.raw.charset,
      lang: facts.lang,
      h1Count: facts.h1Count,
      favicon: facts.favicon,
      og: {
        title: facts.raw.ogTitle,
        description: facts.raw.ogDescription,
        image: facts.raw.ogImage ? resolveUrl(facts.raw.ogImage, finalUrl) : "",
        url: facts.raw.ogUrl ? resolveUrl(facts.raw.ogUrl, finalUrl) : "",
        type: facts.raw.ogType,
        siteName: facts.raw.ogSiteName,
      },
      twitter: {
        card: facts.raw.twitterCard,
        title: facts.raw.twitterTitle,
        description: facts.raw.twitterDescription,
        image: facts.raw.twitterImage ? resolveUrl(facts.raw.twitterImage, finalUrl) : "",
      },
    };

    const host = (() => {
      try {
        return new URL(finalUrl).hostname;
      } catch {
        return target.hostname;
      }
    })();

    return {
      ok: true,
      requestedUrl: target.toString(),
      finalUrl,
      host,
      siteName: facts.raw.ogSiteName || host.replace(/^www\./i, ""),
      statusCode: doc.statusCode,
      elapsedMs: doc.elapsedMs,
      bytes: doc.bytes,
      analyzedAt: new Date().toISOString(),
      score,
      grade,
      groups: summariseGroups(checks),
      checks,
      recommendations: buildRecommendations(checks),
      meta,
      rawHead: facts.headHtml.slice(0, 60000),
      headTruncated: facts.headHtml.length > 60000,
    };
  } catch (error) {
    if (error instanceof AnalysisError) {
      return {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          hint: error.hint || "",
        },
      };
    }
    return {
      ok: false,
      error: {
        code: "unexpected",
        message: "Something went wrong while analyzing that page.",
        hint: "Please try again, or try a different URL.",
      },
    };
  }
}