const FIRST = ["Ava", "Noah", "Mia", "Liam", "Sofia", "Kai", "Elena", "Omar", "Priya", "Leo"];
const LAST = ["Chen", "Patel", "Nguyen", "Garcia", "Okoye", "Berg", "Silva", "Khan", "Novak", "Reed"];
const PRODUCTS = [
  "Forge Clamp",
  "Anvil Stand",
  "Local SSD",
  "Wave Mic",
  "Canvas Kit",
  "Regex Card",
  "Hash Token",
  "Proxy Node",
];

export type JsonDataset = "users" | "products" | "geojson";
export type TableRows = 10 | 100 | 1000;
export type BinaryKind = "bin" | "txt" | "pdf" | "mp4";

export function generateJsonSample(dataset: JsonDataset, rows = 10): string {
  if (dataset === "users") {
    return JSON.stringify(
      Array.from({ length: rows }, (_, index) => ({
        id: index + 1,
        name: `${FIRST[index % FIRST.length]} ${LAST[index % LAST.length]}`,
        email: `user${index + 1}@localforge.dev`,
        role: index % 7 === 0 ? "admin" : "member",
        active: index % 4 !== 0,
      })),
      null,
      2,
    );
  }
  if (dataset === "products") {
    return JSON.stringify(
      Array.from({ length: rows }, (_, index) => ({
        sku: `LF-${String(1000 + index)}`,
        name: PRODUCTS[index % PRODUCTS.length],
        price: Number((9.99 + (index % 12) * 4.5).toFixed(2)),
        stock: (index * 7) % 140,
        currency: "USD",
      })),
      null,
      2,
    );
  }
  return JSON.stringify(
    {
      type: "FeatureCollection",
      features: Array.from({ length: rows }, (_, index) => ({
        type: "Feature",
        properties: { id: index + 1, name: `Point ${index + 1}` },
        geometry: {
          type: "Point",
          coordinates: [-122.4 + (index % 8) * 0.05, 37.7 + Math.floor(index / 8) * 0.03],
        },
      })),
    },
    null,
    2,
  );
}

export function generateCsvSample(rows: TableRows): string {
  const header = "id,name,email,role,active";
  const lines = Array.from({ length: rows }, (_, index) => {
    const name = `${FIRST[index % FIRST.length]} ${LAST[index % LAST.length]}`;
    return `${index + 1},${name},user${index + 1}@localforge.dev,${index % 7 === 0 ? "admin" : "member"},${index % 4 !== 0}`;
  });
  return [header, ...lines].join("\n");
}

export function generateSqlSample(rows: TableRows): string {
  const inserts = Array.from({ length: rows }, (_, index) => {
    const name = `${FIRST[index % FIRST.length]} ${LAST[index % LAST.length]}`.replace(/'/g, "''");
    return `INSERT INTO users (id, name, email, role, active) VALUES (${index + 1}, '${name}', 'user${index + 1}@localforge.dev', '${index % 7 === 0 ? "admin" : "member"}', ${index % 4 !== 0 ? 1 : 0});`;
  });
  return [
    "CREATE TABLE users (",
    "  id INTEGER PRIMARY KEY,",
    "  name TEXT NOT NULL,",
    "  email TEXT NOT NULL UNIQUE,",
    "  role TEXT NOT NULL,",
    "  active INTEGER NOT NULL",
    ");",
    "",
    ...inserts,
  ].join("\n");
}

export function generateYamlSample(): string {
  return [
    "app: LocalForge",
    "privacy: local-first",
    "features:",
    "  - json",
    "  - regex",
    "  - converters",
    "limits:",
    "  upload_by_default: false",
    "  telemetry: none",
  ].join("\n");
}

export function generateXmlSample(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<catalog>",
    '  <item sku="LF-1000">',
    "    <name>LocalForge Sample</name>",
    "    <price currency=\"USD\">0</price>",
    "  </item>",
    "</catalog>",
    "",
  ].join("\n");
}

export function generateHtmlSample(): string {
  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="utf-8" />',
    "  <title>LocalForge Dummy Page</title>",
    "</head>",
    "<body>",
    "  <h1>Dummy HTML</h1>",
    "  <p>Generated in the browser for upload and parser tests.</p>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

export function generateMarkdownSample(): string {
  return [
    "# LocalForge dummy markdown",
    "",
    "Use this file to test README previews, CMS uploads, and markdown parsers.",
    "",
    "- Client-side generation",
    "- No network",
    "- Safe fixture data",
    "",
  ].join("\n");
}

const MINIMAL_PDF = `%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>endobj
trailer<< /Root 1 0 R >>
%%EOF
`;

const MINIMAL_MP4 = Uint8Array.from([
  0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0, 0, 2, 0, 0x69, 0x73, 0x6f, 0x6d,
  0x69, 0x73, 0x6f, 0x32,
]);

export async function generateBinarySample(bytes: number, kind: BinaryKind): Promise<Blob> {
  const payload = new Uint8Array(bytes);
  const chunk = 65536;
  for (let offset = 0; offset < bytes; offset += chunk) {
    crypto.getRandomValues(payload.subarray(offset, Math.min(offset + chunk, bytes)));
  }

  if (kind === "pdf") {
    const header = new TextEncoder().encode(MINIMAL_PDF);
    payload.set(header.subarray(0, Math.min(header.length, bytes)));
    return new Blob([payload], { type: "application/pdf" });
  }
  if (kind === "mp4") {
    payload.set(MINIMAL_MP4.subarray(0, Math.min(MINIMAL_MP4.length, bytes)));
    return new Blob([payload], { type: "video/mp4" });
  }
  if (kind === "txt") {
    return new Blob([payload], { type: "text/plain" });
  }
  return new Blob([payload], { type: "application/octet-stream" });
}

export function mimeForBinary(kind: BinaryKind): string {
  if (kind === "pdf") return "application/pdf";
  if (kind === "mp4") return "video/mp4";
  if (kind === "txt") return "text/plain";
  return "application/octet-stream";
}
