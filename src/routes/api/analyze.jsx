import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Code2, FileText, Lightbulb, ScanSearch, Share2, Search } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeSite } from "@/lib/server-fns";
import AppShell from "@/components/layout/AppShell";
import UrlForm from "@/components/home/UrlForm";
import LoadingState from "@/components/report/LoadingState";
import ErrorState from "@/components/report/ErrorState";
import OverviewHeader from "@/components/report/OverviewHeader";
import ScoreCard from "@/components/report/scorecard";
import TagSection from "@/components/report/TagSection";
import Recommendations from "@/components/report/Recommendations";
import GooglePreview from "@/components/report/GooglePreview";
import SocialPreviews from "@/components/report/SocialPreviews";
import RawHtmlView from "@/components/report/RawHtmlView";

export const Route = createFileRoute("/analyze")({
  validateSearch: (search) => ({
    url: typeof search.url === "string" ? search.url : undefined,
  }),
  head: () => ({
    meta: [
      { title: "SEO report — MetaLens" },
      {
        name: "description",
        content: "Real meta tag extraction, an SEO score out of 100, and Google plus social previews.",
      },
    ],
  }),
  component: AnalyzePage,
});

const SECTIONS = [
  { id: "score", label: "Score", icon: BarChart3 },
  { id: "tags", label: "Tags", icon: FileText },
  { id: "recommendations", label: "Fixes", icon: Lightbulb },
  { id: "google", label: "Google", icon: Search },
  { id: "social", label: "Social", icon: Share2 },
  { id: "raw", label: "HTML", icon: Code2 },
];

function AnalyzePage() {
  const { url } = Route.useSearch();
  const analyze = useServerFn(analyzeSite);
  const analyzeRef = useRef(analyze);
  analyzeRef.current = analyze;

  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    if (!url) {
      setState({ status: "empty" });
      return;
    }
    let active = true;
    setState({ status: "loading" });

    analyzeRef
      .current({ data: { url } })
      .then((result) => {
        if (!active) return;
        if (result?.ok) setState({ status: "ready", report: result });
        else setState({ status: "error", error: result?.error });
      })
      .catch(() => {
        if (!active) return;
        setState({
          status: "error",
          error: {
            code: "unexpected",
            message: "We couldn't analyze that page.",
            hint: "Check the URL, then try again.",
          },
        });
      });

    return () => {
      active = false;
    };
  }, [url, attempt]);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            New analysis
          </Link>
          {state.status === "ready" && (
            <div className="no-scrollbar flex w-full max-w-full min-w-0 gap-1 overflow-x-auto rounded-full border border-border bg-card p-1 sm:w-auto">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <section.icon className="h-3 w-3" />
                  {section.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          {state.status === "empty" && (
            <div className="mx-auto max-w-xl py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <ScanSearch className="h-6 w-6" />
              </span>
              <h1 className="mt-5 font-heading text-3xl text-foreground">Paste a URL to analyze</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter any public webpage and we'll read its real meta tags.
              </p>
              <div className="mt-6">
                <UrlForm />
              </div>
            </div>
          )}

          {state.status === "loading" && <LoadingState url={url} />}

          {state.status === "error" && (
            <ErrorState error={state.error} url={url} onRetry={() => setAttempt((value) => value + 1)} />
          )}

          {state.status === "ready" && (
            <div className="space-y-10 animate-fade-in sm:space-y-12">
              <OverviewHeader report={state.report} />
              <ScoreCard
                score={state.report.score}
                grade={state.report.grade}
                groups={state.report.groups}
              />
              <TagSection checks={state.report.checks} />
              <Recommendations
                recommendations={state.report.recommendations}
                score={state.report.score}
              />
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
                <GooglePreview report={state.report} />
                <SocialPreviews report={state.report} />
              </div>
              <RawHtmlView
                html={state.report.rawHead}
                truncated={state.report.headTruncated}
              />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}