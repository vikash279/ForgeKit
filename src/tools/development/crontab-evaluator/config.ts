import type { ToolConfig } from "@/types/tool";

export const crontabEvaluatorConfig: ToolConfig = {
  slug: "crontab-evaluator",
  category: "development",
  name: "Crontab Evaluator",
  shortName: "Cron",
  description: "Explain cron expressions in plain English and preview the next five run times.",
  seoTitle: "Cron Expression Parser & Next Run Times",
  seoDescription:
    "Parse 5-field cron expressions, generate human-readable explanations, and list the next scheduled executions.",
  keywords: ["cron parser", "crontab", "cron next run", "schedule"],
  executionTarget: "CLIENT",
  icon: "Clock",
  inputs: [{ id: "expression", label: "Cron expression", kind: "text" }],
  outputs: [{ id: "schedule", label: "Schedule", kind: "text" }],
  sampleData: "*/15 9-17 * * 1-5",
};
