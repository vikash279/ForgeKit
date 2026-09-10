import type { ToolConfig } from "@/types/tool";

export const sqlFormatterConfig: ToolConfig = {
  slug: "sql-formatter",
  category: "development",
  name: "SQL Designer & Formatter",
  shortName: "SQL",
  description: "Pretty-print SQL and generate CREATE TABLE schema scripts from a compact designer.",
  seoTitle: "SQL Formatter & Schema Script Generator",
  seoDescription:
    "Format SQL queries and generate CREATE TABLE statements from a lightweight schema designer. Client-side only.",
  keywords: ["sql formatter", "sql pretty print", "create table generator"],
  executionTarget: "CLIENT",
  icon: "Database",
  inputs: [{ id: "sql", label: "SQL", kind: "code" }],
  outputs: [{ id: "formatted", label: "Formatted SQL", kind: "code" }],
  sampleData: "select u.id,u.email,count(o.id) from users u left join orders o on o.user_id=u.id where u.active=1 group by u.id order by 3 desc;",
};
