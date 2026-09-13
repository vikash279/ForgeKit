import type { ToolConfig } from "@/types/tool";

export const jsonCsvYamlConfig: ToolConfig = {
  slug: "json-csv-yaml",
  category: "converters",
  name: "JSON ↔ CSV ↔ YAML Converter",
  shortName: "Data Convert",
  description: "Convert JSON, CSV, and YAML in a split-pane editor with live parsing, delimiters, and pretty-print.",
  seoTitle: "JSON to CSV to YAML Converter Online",
  seoDescription:
    "Convert JSON, CSV, and YAML in your browser. Live split-pane parsing, delimiter control, and pretty-print — private, zero upload, free.",
  keywords: ["json to csv", "csv to yaml", "yaml to json", "data converter"],
  targetKeywords: ["json to csv converter", "yaml to json online", "csv to json private"],
  executionTarget: "CLIENT",
  icon: "ArrowLeftRight",
  inputs: [{ id: "source", label: "Source data", kind: "text" }],
  outputs: [{ id: "converted", label: "Converted data", kind: "text" }],
  sampleData: JSON.stringify(
    [
      { id: 1, name: "LocalForge", kind: "utility" },
      { id: 2, name: "Waveform", kind: "audio" },
    ],
    null,
    2,
  ),
  relatedSlugs: ["json-formatter", "sample-files"],
  howToSteps: [
    "Paste JSON, CSV, or YAML into the left pane and set the source format.",
    "Choose the target format, delimiter, header row, and pretty-print.",
    "Read the live conversion on the right and fix any parse errors.",
    "Copy or download the result. Parsing never leaves the browser.",
  ],
  featureNotes: [
    "Bidirectional JSON ↔ CSV ↔ YAML.",
    "CSV delimiters: comma, tab, semicolon.",
    "Header toggle for CSV import and export.",
    "Pretty-print for JSON and YAML.",
    "Client-side only via the yaml package and a local CSV parser.",
  ],
  faq: [
    {
      question: "Does the JSON to CSV converter upload my spreadsheet?",
      answer: "No. Conversion runs locally. Paste or upload a file and it stays in this tab.",
    },
    {
      question: "Can I convert YAML to JSON online privately?",
      answer: "Yes. YAML is parsed in the browser and emitted as JSON or CSV with no account.",
    },
    {
      question: "Which CSV delimiters are supported?",
      answer: "Comma, tab, and semicolon, with an optional header row.",
    },
  ],
};
