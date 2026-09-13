import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export type DataFormat = "json" | "csv" | "yaml";
export type CsvDelimiter = "," | "\t" | ";";

export function convertData(
  input: string,
  from: DataFormat,
  to: DataFormat,
  options: { delimiter: CsvDelimiter; headers: boolean; pretty: boolean },
): string {
  const value = parseData(input, from, options);
  return serializeData(value, to, options);
}

export function parseData(
  input: string,
  format: DataFormat,
  options: { delimiter: CsvDelimiter; headers: boolean },
): unknown {
  const text = input.trim();
  if (!text) return null;
  if (format === "json") return JSON.parse(text);
  if (format === "yaml") return parseYaml(text);
  return csvToJson(text, options.delimiter, options.headers);
}

export function serializeData(
  value: unknown,
  format: DataFormat,
  options: { delimiter: CsvDelimiter; headers: boolean; pretty: boolean },
): string {
  if (format === "json") {
    return options.pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value);
  }
  if (format === "yaml") {
    return stringifyYaml(value, { indent: options.pretty ? 2 : 0 });
  }
  return jsonToCsv(value, options.delimiter, options.headers);
}

function csvToJson(text: string, delimiter: CsvDelimiter, headers: boolean): unknown[] {
  const rows = parseCsvRows(text, delimiter);
  if (rows.length === 0) return [];
  if (!headers) return rows;
  const head = rows[0] ?? [];
  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {};
    head.forEach((key, index) => {
      record[key || `col_${index + 1}`] = row[index] ?? "";
    });
    return record;
  });
}

function jsonToCsv(value: unknown, delimiter: CsvDelimiter, headers: boolean): string {
  const rows = toObjectRows(value);
  if (rows.length === 0) return "";
  const keys = uniqueKeys(rows);
  const lines: string[] = [];
  if (headers) lines.push(keys.map((key) => escapeCsv(key, delimiter)).join(delimiter));
  for (const row of rows) {
    lines.push(keys.map((key) => escapeCsv(stringifyCell(row[key]), delimiter)).join(delimiter));
  }
  return lines.join("\n");
}

function toObjectRows(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      typeof item === "object" && item !== null
        ? (item as Record<string, unknown>)
        : { value: item, index },
    );
  }
  if (typeof value === "object" && value !== null) return [value as Record<string, unknown>];
  return [{ value }];
}

function uniqueKeys(rows: Record<string, unknown>[]): string[] {
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (seen.has(key)) continue;
      seen.add(key);
      keys.push(key);
    }
  }
  return keys;
}

function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function escapeCsv(value: string, delimiter: CsvDelimiter): string {
  if (value.includes(delimiter) || value.includes('"') || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function parseCsvRows(text: string, delimiter: CsvDelimiter): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i] ?? "";
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === delimiter) {
      row.push(field);
      field = "";
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    if (char !== "\r") field += char;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
