const KEYWORDS = [
  "select",
  "from",
  "where",
  "and",
  "or",
  "left",
  "right",
  "inner",
  "outer",
  "join",
  "on",
  "group",
  "by",
  "order",
  "limit",
  "offset",
  "insert",
  "into",
  "values",
  "update",
  "set",
  "delete",
  "create",
  "table",
  "primary",
  "key",
  "not",
  "null",
  "default",
];

export function formatSql(sql: string): string {
  const tokens = sql
    .replace(/\s+/g, " ")
    .trim()
    .replace(/,(?!\s)/g, ", ")
    .split(" ");
  const lines: string[] = [];
  let current = "";
  const flush = () => {
    if (current.trim()) lines.push(current.trim());
    current = "";
  };
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (["from", "where", "left", "right", "inner", "join", "group", "order", "limit", "values", "set"].includes(lower)) {
      flush();
      current = token;
    } else {
      current = current ? `${current} ${token}` : token;
    }
  }
  flush();
  return lines
    .map((line) =>
      line
        .split(" ")
        .map((token) => (KEYWORDS.includes(token.toLowerCase()) ? token.toUpperCase() : token))
        .join(" "),
    )
    .join("\n");
}

export interface SchemaColumn {
  name: string;
  type: string;
  primary?: boolean;
}

export function createTableSql(table: string, columns: SchemaColumn[]): string {
  const body = columns
    .map((column) => {
      const bits = [`  ${column.name} ${column.type.toUpperCase()}`];
      if (column.primary) bits.push("PRIMARY KEY");
      return bits.join(" ");
    })
    .join(",\n");
  return `CREATE TABLE ${table} (\n${body}\n);`;
}
