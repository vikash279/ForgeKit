import type { ToolConfig } from "@/types/tool";

export const regexTesterConfig: ToolConfig = {
  slug: "regex-tester",
  category: "development",
  name: "Regex Tester & Debugger",
  shortName: "Regex",
  description: "Test regular expressions in real time with group extraction and a cheatsheet.",
  seoTitle: "Regex Tester, Debugger & Capture Groups",
  seoDescription:
    "Free JavaScript regex tester in your browser. Live matches, capture groups, and flags — private client-side debugging with zero data upload. No account needed.",
  keywords: ["regex tester", "regular expression", "capture groups", "javascript regex"],
  targetKeywords: [
    "regex tester online",
    "javascript regex debugger",
    "regex capture groups",
    "test regular expression",
    "private regex tester",
  ],
  executionTarget: "CLIENT",
  icon: "Regex",
  inputs: [
    { id: "pattern", label: "Pattern", kind: "text" },
    { id: "haystack", label: "Test string", kind: "text" },
  ],
  outputs: [{ id: "matches", label: "Matches", kind: "json" }],
  sampleData: "The quick brown fox jumps over 12 lazy dogs.",
  relatedSlugs: ["json-formatter"],
  howToSteps: [
    "Enter a JavaScript regular expression pattern and optional flags (g, i, m, s, u, y).",
    "Paste the test string you want to match against in the haystack pane.",
    "Read live matches, capture groups, and index ranges as you type — no Run button required.",
    "Use the cheatsheet for tokens, then copy the pattern. The sample never leaves your browser.",
  ],
  featureNotes: [
    "JavaScript RegExp engine (ECMA-262), not PCRE or Python — lookarounds and named groups follow JS rules.",
    "Flags: global (g), ignoreCase (i), multiline (m), dotAll (s), unicode (u), sticky (y).",
    "Live capture-group extraction and match indexes for debugging replacements.",
    "Built-in regex cheatsheet for character classes, anchors, and quantifiers.",
    "Catastrophic backtracking can freeze the tab on pathological patterns; keep test strings reasonably sized.",
    "Client-side only: logs, emails, and production samples are not uploaded.",
  ],
  faq: [
    {
      question: "How do I test JavaScript regex online privately?",
      answer:
        "Use LocalForge’s regex tester. Patterns and haystacks are evaluated with the browser’s RegExp engine — there is no server round trip and no account.",
    },
    {
      question: "Does the regex tester show capture groups?",
      answer:
        "Yes. Each match lists numbered and, when present, named capture groups so you can debug replacements before shipping code.",
    },
    {
      question: "Which regex flags are supported?",
      answer:
        "The debugger supports standard JavaScript flags: g, i, m, s, u, and y. Flavor differences versus PCRE (possessive quantifiers, for example) are not emulated.",
    },
    {
      question: "Is my test string sent to a server?",
      answer:
        "No. Zero data upload. Regular expression testing runs locally so you can paste production logs or PII without sharing them with LocalForge.",
    },
  ],
};
