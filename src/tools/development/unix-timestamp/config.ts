import type { ToolConfig } from "@/types/tool";

export const unixTimestampConfig: ToolConfig = {
  slug: "unix-timestamp",
  category: "development",
  name: "Unix Timestamp Converter",
  shortName: "Epoch",
  description: "Convert epoch seconds/milliseconds to human dates with live clock and timezone offsets.",
  seoTitle: "Unix Timestamp Converter & Live Epoch Clock",
  seoDescription:
    "Convert Unix timestamps to dates in your browser. Seconds or milliseconds, UTC and local — private epoch converter with zero data upload. No account needed.",
  keywords: ["unix timestamp", "epoch converter", "utc date", "timezone"],
  targetKeywords: [
    "unix timestamp converter",
    "epoch converter online",
    "convert unix time to date",
    "unix timestamp milliseconds",
    "utc epoch converter",
  ],
  executionTarget: "CLIENT",
  icon: "Timer",
  inputs: [{ id: "epoch", label: "Timestamp or date", kind: "text" }],
  outputs: [{ id: "converted", label: "Converted values", kind: "json" }],
  sampleData: "1710000000",
  howToSteps: [
    "Paste a Unix timestamp in seconds or milliseconds, or type a human-readable date.",
    "Compare UTC and local conversions, then apply a timezone offset if you need a fixed zone.",
    "Use the live epoch clock to grab “now” in seconds or milliseconds for APIs and databases.",
    "Copy the converted values. All math runs in the browser — nothing is uploaded.",
  ],
  featureNotes: [
    "Accepts epoch seconds and milliseconds; values ≥ 1e12 are treated as milliseconds.",
    "Round-trip between Unix time and ISO-8601 / locale date strings.",
    "UTC vs local display plus numeric timezone offsets.",
    "Live clock for current Unix time, useful when signing tokens or writing cron windows.",
    "Year 2038: JavaScript uses IEEE-754 numbers; extreme 32-bit signed Unix limits do not apply in this converter.",
    "Client-side only — timestamps from logs or production DBs never leave the tab.",
  ],
  faq: [
    {
      question: "How do I convert a Unix timestamp to a date online?",
      answer:
        "Paste the epoch value into LocalForge’s Unix timestamp converter. It detects seconds vs milliseconds and shows UTC and local dates instantly in your browser.",
    },
    {
      question: "Does this epoch converter support milliseconds?",
      answer:
        "Yes. Use seconds for classic Unix time or milliseconds for JavaScript Date.now() values. You can also convert a date back to both units.",
    },
    {
      question: "Is timezone conversion done locally?",
      answer:
        "Yes. Offset and locale formatting run client-side with zero data upload, so incident timestamps never hit a remote API.",
    },
    {
      question: "What is the Unix epoch?",
      answer:
        "Unix time counts seconds (or milliseconds) since 00:00:00 UTC on 1 January 1970. This tool translates that integer into human dates and back.",
    },
  ],
};
