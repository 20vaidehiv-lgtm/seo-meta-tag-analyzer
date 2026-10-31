import { useState } from "react";
import { Facebook, Info, Linkedin, Twitter } from "lucide-react";
import FacebookCard from "@/components/report/social/FacebookCard";
import LinkedInCard from "@/components/report/social/LinkedInCard";
import XCard from "@/components/report/social/Xcard";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "x", label: "X / Twitter", icon: Twitter },
];

export default function SocialPreviews({ report }) {
  const [tab, setTab] = useState("facebook");
  const { meta, host } = report;

  const title = meta.og.title || meta.title || host;
  const description =
    meta.og.description || meta.description || "No description found — platforms will guess from page content.";
  const image = meta.og.image || meta.twitter.image || "";
  const xImage = meta.twitter.image || meta.og.image || "";
  const xTitle = meta.twitter.title || title;
  const xDescription = meta.twitter.description || description;

  const shared = { title, description, image, host };

  return (
    <section id="social" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">Social previews</p>
          <h2 className="mt-1.5 font-heading text-2xl text-foreground sm:text-3xl">How it looks when shared</h2>
        </div>
        <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[10.5px] text-muted-foreground">
          twitter:card = {meta.twitter.card || "none"}
        </span>
      </div>

      <div className="mt-5 rounded-3xl border border-border bg-card p-4 sm:p-6">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-[hsl(var(--surface-sunken))] p-1">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-medium transition-all duration-200",
                tab === item.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-[440px] animate-fade-in" key={tab}>
          {tab === "facebook" && <FacebookCard {...shared} />}
          {tab === "linkedin" && <LinkedInCard {...shared} />}
          {tab === "x" && (
            <XCard title={xTitle} description={xDescription} image={xImage} host={host} />
          )}
        </div>

        {!meta.og.image && (
          <p className="mx-auto mt-4 flex max-w-[440px] items-start gap-1.5 rounded-xl bg-[hsl(var(--warn-soft))] px-3 py-2 text-[11px] leading-relaxed text-[hsl(var(--warn))]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            This page has no og:image, so platforms show a text-only card. Add a 1200 × 630 px image to fix it.
          </p>
        )}

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Rendered from this page's Open Graph and Twitter tags — cached previews may differ until the platform refreshes them.
        </p>
      </div>
    </section>
  );
}