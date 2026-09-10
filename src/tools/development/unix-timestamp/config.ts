import type { ToolConfig } from "@/types/tool";

export const unixTimestampConfig: ToolConfig = {
  slug: "unix-timestamp",
  category: "development",
  name: "Unix Timestamp Converter",
  shortName: "Epoch",
  description: "Convert epoch seconds/milliseconds to human dates with live clock and timezone offsets.",
  seoTitle: "Unix Timestamp Converter & Live Epoch Clock",
  seoDescription:
    "Convert Unix epoch values to local and UTC dates, or dates back to timestamps, with timezone offset support.",
  keywords: ["unix timestamp", "epoch converter", "utc date", "timezone"],
  executionTarget: "CLIENT",
  icon: "Timer",
  inputs: [{ id: "epoch", label: "Timestamp or date", kind: "text" }],
  outputs: [{ id: "converted", label: "Converted values", kind: "json" }],
  sampleData: "1710000000",
};
