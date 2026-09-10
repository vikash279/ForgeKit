import dns from "node:dns/promises";
import net from "node:net";
import { NextResponse } from "next/server";
import { assertPublicHostname, fetchPublicUrl, parsePublicHttpUrl } from "@/lib/net/ssrf";
import { getRegisteredTool } from "@/registry";

export const runtime = "nodejs";

const MAX_BODY = 750_000;
const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"] as const;
const DNS_TYPES = ["A", "CNAME", "MX", "TXT"] as const;

type DnsType = (typeof DNS_TYPES)[number];
type HttpMethod = (typeof ALLOWED_METHODS)[number];

interface HttpProxyBody {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface DnsProxyBody {
  host?: string;
  types?: string[];
  port?: number;
}

interface AssetProxyBody {
  url?: string;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const tool = getRegisteredTool("website", slug);
  if (!tool || tool.config.executionTarget !== "SERVER_PROXY") {
    return NextResponse.json({ error: "Unknown proxy tool." }, { status: 404 });
  }

  try {
    const payload: unknown = await request.json();
    if (slug === "http-simulator") return await handleHttp(payload);
    if (slug === "dns-port-checker") return await handleDnsPort(payload);
    if (slug === "website-asset-extractor") return await handleAssets(payload);
    return NextResponse.json({ error: "No handler for this slug." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function handleHttp(payload: unknown): Promise<NextResponse> {
  const body = asObject(payload) as HttpProxyBody;
  const method = (body.method ?? "GET").toUpperCase();
  if (!isHttpMethod(method)) throw new Error("Unsupported HTTP method.");
  if (!body.url) throw new Error("URL is required.");
  parsePublicHttpUrl(body.url);

  const start = Date.now();
  const response = await fetchPublicUrl(body.url, {
    method,
    headers: sanitizeHeaders(body.headers ?? {}),
    body: method === "GET" || method === "HEAD" ? undefined : body.body,
    timeoutMs: 10000,
  });
  const text = (await response.text()).slice(0, MAX_BODY);
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return NextResponse.json({
    status: response.status,
    statusText: response.statusText,
    headers,
    body: text,
    truncated: text.length >= MAX_BODY,
    durationMs: Date.now() - start,
    redirected: response.type === "opaqueredirect" || [301, 302, 303, 307, 308].includes(response.status),
  });
}

async function handleDnsPort(payload: unknown): Promise<NextResponse> {
  const body = asObject(payload) as DnsProxyBody;
  if (!body.host) throw new Error("Host is required.");
  const host = body.host.trim().toLowerCase();
  await assertPublicHostname(host);

  const requested = (body.types ?? [...DNS_TYPES]).filter(isDnsType);
  const records: Record<string, string[]> = {};
  for (const type of requested) {
    records[type] = await resolveDns(host, type);
  }

  let port: { port: number; open: boolean; latencyMs: number } | null = null;
  if (typeof body.port === "number") {
    if (!Number.isInteger(body.port) || body.port < 1 || body.port > 65535) {
      throw new Error("Port must be between 1 and 65535.");
    }
    port = await probePort(host, body.port);
  }

  return NextResponse.json({ host, records, port });
}

async function handleAssets(payload: unknown): Promise<NextResponse> {
  const body = asObject(payload) as AssetProxyBody;
  if (!body.url) throw new Error("URL is required.");
  const url = parsePublicHttpUrl(body.url);
  const response = await fetchPublicUrl(url.toString(), { method: "GET", timeoutMs: 10000 });
  const html = (await response.text()).slice(0, MAX_BODY);
  const base = url;
  const pick = (regex: RegExp): string[] => {
    const found = new Set<string>();
    for (const match of html.matchAll(regex)) {
      const raw = match[1];
      if (!raw) continue;
      try {
        found.add(new URL(raw, base).toString());
      } catch {
        /* skip malformed */
      }
    }
    return [...found].slice(0, 200);
  };

  return NextResponse.json({
    url: url.toString(),
    status: response.status,
    title: html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null,
    links: pick(/<a[^>]+href=["']([^"']+)["']/gi),
    images: pick(/<img[^>]+src=["']([^"']+)["']/gi),
    scripts: pick(/<script[^>]+src=["']([^"']+)["']/gi),
    stylesheets: pick(/<link[^>]+href=["']([^"']+)["']/gi),
    htmlPreview: html.slice(0, 4000),
  });
}

function asObject(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("JSON object body required.");
  }
  return value as Record<string, unknown>;
}

function isHttpMethod(value: string): value is HttpMethod {
  return (ALLOWED_METHODS as readonly string[]).includes(value);
}

function isDnsType(value: string): value is DnsType {
  return (DNS_TYPES as readonly string[]).includes(value);
}

function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const blocked = new Set(["host", "cookie", "authorization", "content-length"]);
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (blocked.has(key.toLowerCase())) continue;
    if (typeof value === "string" && value.length < 4000) clean[key] = value;
  }
  return clean;
}

async function resolveDns(host: string, type: DnsType): Promise<string[]> {
  try {
    if (type === "A") {
      const records = await dns.resolve4(host);
      return records;
    }
    if (type === "CNAME") {
      return await dns.resolveCname(host);
    }
    if (type === "MX") {
      const records = await dns.resolveMx(host);
      return records.map((record) => `${record.priority} ${record.exchange}`);
    }
    const records = await dns.resolveTxt(host);
    return records.map((record) => record.join(""));
  } catch {
    return [];
  }
}

function probePort(host: string, port: number): Promise<{ port: number; open: boolean; latencyMs: number }> {
  const start = Date.now();
  return new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout: 2500 });
    const done = (open: boolean) => {
      socket.destroy();
      resolve({ port, open, latencyMs: Date.now() - start });
    };
    socket.on("connect", () => done(true));
    socket.on("timeout", () => done(false));
    socket.on("error", () => done(false));
  });
}
