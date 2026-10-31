import { Link } from "@tanstack/react-router";
import { ScanSearch } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function AppShell({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-6">
              <ScanSearch className="h-[18px] w-[18px]" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-semibold tracking-tight">
                MetaLens
              </span>
              <span className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                SEO Analyzer
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="/#how-it-works"
              className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              How it works
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>MetaLens analyzes public metadata only — no accounts, no crawling beyond the page you enter.</p>
          <p>Scores are our own metadata assessment, not a ranking guarantee.</p>
        </div>
      </footer>
    </div>
  );
}