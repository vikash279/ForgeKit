import type { ToolConfig } from "@/types/tool";

export const urlHtmlEncoderConfig: ToolConfig = {
  slug: "url-html-encoder",
  category: "security",
  name: "URL & HTML Entity Encoder",
  shortName: "Entities",
  description: "Encode or decode URI components and HTML entities with a dual-mode workspace.",
  seoTitle: "URL Encode Decode & HTML Entity Converter",
  seoDescription:
    "Percent-encode URLs and escape HTML entities (or reverse them) without sending data to a server.",
  keywords: ["url encode", "html entities", "decode uri component"],
  executionTarget: "CLIENT",
  icon: "Link2",
  inputs: [{ id: "text", label: "Input", kind: "text" }],
  outputs: [{ id: "encoded", label: "Output", kind: "text" }],
  sampleData: `<a href="https://example.com?q=localforge">LocalForge & Co</a>`,
};
