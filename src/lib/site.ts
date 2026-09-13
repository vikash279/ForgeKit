export const SITE_NAME = "LocalForge";
export const SITE_TAGLINE = "Privacy-first developer and webmaster utilities";
export const SITE_DESCRIPTION =
  "Lightning-fast JSON, regex, crypto, HTTP, DNS, image, and SEO utilities that run in your browser. No accounts. No telemetry. No upload-by-default.";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
