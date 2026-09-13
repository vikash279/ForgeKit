import type { ToolConfig } from "@/types/tool";

export const jsonFormatterConfig: ToolConfig = {
  slug: "json-formatter",
  category: "development",
  name: "JSON Formatter & Validator",
  shortName: "JSON",
  description: "Beautify, minify, validate, and inspect JSON trees entirely in the browser.",
  seoTitle: "JSON Formatter, Validator & Tree Inspector",
  seoDescription:
    "Free private JSON formatter in your browser. Beautify, minify, and validate locally with line errors, a tree view, and zero data upload. No account needed.",
  keywords: ["json formatter", "json validator", "json tree", "beautify json", "minify json"],
  targetKeywords: [
    "json formatter online",
    "free json validator",
    "beautify json",
    "minify json",
    "json tree viewer",
    "private json formatter",
  ],
  executionTarget: "CLIENT",
  icon: "Braces",
  inputs: [{ id: "json", label: "JSON input", kind: "json" }],
  outputs: [{ id: "formatted", label: "Formatted JSON", kind: "json" }],
  sampleData: `{
  "product": "LocalForge",
  "privacy": true,
  "tools": ["json", "regex", "hash"],
  "meta": { "version": 1, "ok": true }
}`,
  relatedSlugs: ["regex-tester", "sql-formatter"],
  howToSteps: [
    "Paste JSON or upload a .json file into the left pane of the JSON formatter.",
    "Click Format to beautify with indentation, or Minify to strip whitespace for production payloads.",
    "If validation fails, use the line and column error to fix the syntax, then inspect the interactive tree.",
    "Copy or download the result. Parsing runs locally — LocalForge never uploads your JSON.",
  ],
  featureNotes: [
    "Strict JSON (RFC 8259): trailing commas, comments, and single quotes are reported as errors.",
    "Line and column diagnostics for missing braces, invalid escapes, and truncated documents.",
    "Beautify and minify in-place without a network round trip.",
    "Interactive tree inspector for nested objects and arrays.",
    "Browser memory is the practical payload limit; nothing is posted to a server.",
    "Works offline after the page loads — ideal for secrets, tokens, and customer data dumps.",
  ],
  faq: [
    {
      question: "Is this JSON formatter free and private?",
      answer:
        "Yes. LocalForge’s JSON formatter online is free, requires no account, and validates JSON entirely in your browser so drafts never hit our servers.",
    },
    {
      question: "Does the JSON validator upload my file?",
      answer:
        "No. Beautify, minify, and tree inspection are client-side. Your JSON stays in this tab with zero data upload.",
    },
    {
      question: "Can I minify and beautify JSON without installing an editor?",
      answer:
        "Yes. Paste a payload, format or minify it, and copy the result. It is a private JSON formatter and JSON minifier that runs in any modern browser.",
    },
    {
      question: "Which JSON standard does LocalForge follow?",
      answer:
        "The parser expects standard RFC 8259 JSON. That means double-quoted keys, no comments, and no trailing commas — the same rules as JSON.parse in JavaScript.",
    },
  ],
};
