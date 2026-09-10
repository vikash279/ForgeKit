import type { MetadataRoute } from "next";
import { getAllToolConfigs, toolHref } from "@/registry";
import { CATEGORY_META, TOOL_CATEGORIES } from "@/types/tool";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const categories = TOOL_CATEGORIES.map((category) => ({
    url: absoluteUrl(CATEGORY_META[category].href),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const tools = getAllToolConfigs().map((tool) => ({
    url: absoluteUrl(toolHref(tool)),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...categories,
    ...tools,
  ];
}
