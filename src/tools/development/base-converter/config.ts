import type { ToolConfig } from "@/types/tool";

export const baseConverterConfig: ToolConfig = {
  slug: "base-converter",
  category: "development",
  name: "Base Converter",
  shortName: "Radix",
  description: "Convert integers between binary, octal, decimal, hex, and custom bases 2–64.",
  seoTitle: "Radix Converter: Binary, Octal, Decimal, Hex, Base64",
  seoDescription:
    "Convert numbers between Base2 and Base64 with live dual-pane output. Runs locally in your browser.",
  keywords: ["base converter", "hex to decimal", "binary converter", "radix"],
  executionTarget: "CLIENT",
  icon: "Binary",
  inputs: [{ id: "value", label: "Source value", kind: "text" }],
  outputs: [{ id: "converted", label: "Converted value", kind: "text" }],
  sampleData: "255",
};
