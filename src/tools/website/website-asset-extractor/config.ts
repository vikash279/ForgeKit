import type { ToolConfig } from "@/types/tool";

export const websiteAssetExtractorConfig: ToolConfig = {
  slug: "website-asset-extractor",
  category: "website",
  name: "Website Asset Extractor",
  shortName: "Assets",
  description: "Fetch public HTML and extract link, script, image, and stylesheet trees.",
  seoTitle: "Website Asset Extractor & Public HTML Mirror Outline",
  seoDescription:
    "Retrieve authorized public pages through a safe proxy and map HTML, links, and static assets. Private networks are blocked.",
  keywords: ["asset extractor", "html mirror", "scrape links", "website assets"],
  executionTarget: "SERVER_PROXY",
  icon: "FolderTree",
  inputs: [{ id: "url", label: "Public URL", kind: "text" }],
  outputs: [{ id: "tree", label: "Asset tree", kind: "json" }],
  sampleData: "https://example.com",
};
