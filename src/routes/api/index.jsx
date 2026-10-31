import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/layout/AppShell";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MetaLens — Analyze Your Website's SEO" },
      {
        name: "description",
        content:
          "Enter any URL to audit its title, description, Open Graph and Twitter tags, get a score out of 100, and preview the Google and social result.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <AppShell>
      <Hero />
      <HowItWorks />
    </AppShell>
  );
}