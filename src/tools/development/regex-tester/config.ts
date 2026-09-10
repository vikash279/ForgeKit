import type { ToolConfig } from "@/types/tool";

export const regexTesterConfig: ToolConfig = {
  slug: "regex-tester",
  category: "development",
  name: "Regex Tester & Debugger",
  shortName: "Regex",
  description: "Test regular expressions in real time with group extraction and a cheatsheet.",
  seoTitle: "Regex Tester, Debugger & Capture Groups",
  seoDescription:
    "Debug JavaScript regular expressions with live matches, capture groups, flags, and a built-in cheatsheet.",
  keywords: ["regex tester", "regular expression", "capture groups", "javascript regex"],
  executionTarget: "CLIENT",
  icon: "Regex",
  inputs: [
    { id: "pattern", label: "Pattern", kind: "text" },
    { id: "haystack", label: "Test string", kind: "text" },
  ],
  outputs: [{ id: "matches", label: "Matches", kind: "json" }],
  sampleData: "The quick brown fox jumps over 12 lazy dogs.",
  relatedSlugs: ["json-formatter"],
};
