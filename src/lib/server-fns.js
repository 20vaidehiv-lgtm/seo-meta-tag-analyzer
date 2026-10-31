import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { analyzeSiteUrl } from "@/lib/seo.server.js";

const analyzeInput = z.object({
  url: z.string().min(1).max(2048),
});

export const analyzeSite = createServerFn({ method: "POST" })
  .validator((data) => analyzeInput.parse(data))
  .handler(async ({ data }) => analyzeSiteUrl(data.url));