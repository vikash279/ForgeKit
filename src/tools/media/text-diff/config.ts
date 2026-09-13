import type { ToolConfig } from "@/types/tool";

export const textDiffConfig: ToolConfig = {
  slug: "text-diff",
  category: "media",
  name: "Text Diff Tool",
  shortName: "Diff",
  description: "Side-by-side and inline visual diffs computed in a dedicated Web Worker.",
  seoTitle: "Side-by-Side & Inline Text Diff Highlighter",
  seoDescription:
    "Compare two texts with LCS-based line diffs, rendered side-by-side or inline. Heavy work stays off the UI thread.",
  keywords: ["text diff", "compare files", "inline diff"],
  executionTarget: "CLIENT",
  icon: "Diff",
  inputs: [
    { id: "left", label: "Original", kind: "text" },
    { id: "right", label: "Revised", kind: "text" },
  ],
  outputs: [{ id: "diff", label: "Diff", kind: "text" }],
  sampleData: "LocalForge ships client-first utilities.",
};
