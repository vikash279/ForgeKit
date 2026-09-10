import dns from "node:dns/promises";
import net from "node:net";

const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.goog",
]);

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return null;
  }
  return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
}

function isPrivateIPv4(ip: string): boolean {
  const value = ipv4ToInt(ip);
  if (value === null) return true;
  return (
    value <= 0x00ffffff ||
    (value >= 0x0a000000 && value <= 0x0affffff) ||
    (value >= 0x7f000000 && value <= 0x7fffffff) ||
    (value >= 0xa9fe0000 && value <= 0xa9feffff) ||
    (value >= 0xac100000 && value <= 0xac1fffff) ||
    (value >= 0xc0a80000 && value <= 0xc0a8ffff) ||
    value >= 0xe0000000
  );
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1" || normalized === "::") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("fe80")) return true;
  if (normalized.includes(".")) {
    const mapped = normalized.split(":").pop();
    if (mapped) return isPrivateIPv4(mapped);
  }
  return false;
}

export async function assertPublicHostname(hostname: string): Promise<string[]> {
  const host = hostname.replace(/\.+$/, "").toLowerCase();
  if (!host || BLOCKED_HOSTS.has(host) || host.endsWith(".localhost") || host.endsWith(".internal")) {
    throw new Error("That host is not allowed.");
  }
  if (net.isIP(host)) {
    const blocked = net.isIPv6(host) ? isPrivateIPv6(host) : isPrivateIPv4(host);
    if (blocked) throw new Error("Private or reserved IP addresses are blocked.");
    return [host];
  }
  const records = await dns.lookup(host, { all: true });
  if (records.length === 0) throw new Error("Host could not be resolved.");
  for (const record of records) {
    const blocked =
      record.family === 6 ? isPrivateIPv6(record.address) : isPrivateIPv4(record.address);
    if (blocked) throw new Error("Host resolves to a private or reserved address.");
  }
  return records.map((record) => record.address);
}

export function parsePublicHttpUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Enter a valid absolute URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed.");
  }
  if (url.username || url.password) {
    throw new Error("URLs with credentials are not allowed.");
  }
  return url;
}

export async function fetchPublicUrl(
  raw: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const url = parsePublicHttpUrl(raw);
  await assertPublicHostname(url.hostname);
  const timeoutMs = init.timeoutMs ?? 8000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "user-agent": "ForgeKit/1.0 (+local-utility-proxy)",
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}
