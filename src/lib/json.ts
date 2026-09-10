import type { ParseIssue } from "@/types/tool";

export function jsonParseIssue(error: unknown, source: string): ParseIssue {
  const message = error instanceof Error ? error.message : "Invalid JSON";
  const lineCol = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineCol) {
    return { message, line: Number(lineCol[1]), column: Number(lineCol[2]) };
  }
  const position = message.match(/position\s+(\d+)/i);
  if (position) {
    const index = Number(position[1]);
    const prefix = source.slice(0, index);
    const lines = prefix.split(/\n/);
    return {
      message,
      line: lines.length,
      column: (lines[lines.length - 1]?.length ?? 0) + 1,
    };
  }
  return { message };
}

export function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeys((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}
