import type { ToolConfig } from "@/types/tool";

export const jsonFormatterConfig: ToolConfig = {
  slug: "json-formatter",
  category: "development",
  name: "JSON Formatter & Validator",
  shortName: "JSON",
  description: "Beautify, minify, validate, and inspect JSON trees entirely in the browser.",
  seoTitle: "JSON Formatter, Validator & Tree Inspector",
  seoDescription:
    "Format, minify, and validate JSON with line/column errors and an interactive tree view. Runs 100% locally.",
  keywords: ["json formatter", "json validator", "json tree", "beautify json", "minify json"],
  executionTarget: "CLIENT",
  icon: "Braces",
  inputs: [{ id: "json", label: "JSON input", kind: "json" }],
  outputs: [{ id: "formatted", label: "Formatted JSON", kind: "json" }],
  sampleData: `{
  "product": "ForgeKit",
  "privacy": true,
  "tools": ["json", "regex", "hash"],
  "meta": { "version": 1, "ok": true }
}`,
  relatedSlugs: ["regex-tester", "sql-formatter"],
};
