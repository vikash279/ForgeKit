"use client";

import dynamic from "next/dynamic";
import type { ToolConfig } from "@/types/tool";

function ToolFallback() {
  return (
    <div className="flex min-h-[28rem] flex-1 items-center justify-center rounded-xl border bg-muted/20 text-sm text-muted-foreground">
      Loading tool…
    </div>
  );
}

const TOOL_COMPONENTS = {
  "development/json-formatter": dynamic(
    () => import("@/tools/development/json-formatter/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "development/regex-tester": dynamic(
    () => import("@/tools/development/regex-tester/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "development/crontab-evaluator": dynamic(
    () => import("@/tools/development/crontab-evaluator/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "development/unix-timestamp": dynamic(
    () => import("@/tools/development/unix-timestamp/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "development/base-converter": dynamic(
    () => import("@/tools/development/base-converter/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "development/nginx-htaccess": dynamic(
    () => import("@/tools/development/nginx-htaccess/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "development/sql-formatter": dynamic(
    () => import("@/tools/development/sql-formatter/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "development/code-obfuscator": dynamic(
    () => import("@/tools/development/code-obfuscator/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "website/http-simulator": dynamic(
    () => import("@/tools/website/http-simulator/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "website/websocket-tester": dynamic(
    () => import("@/tools/website/websocket-tester/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "website/dns-port-checker": dynamic(
    () => import("@/tools/website/dns-port-checker/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "website/website-asset-extractor": dynamic(
    () => import("@/tools/website/website-asset-extractor/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "security/hash-generator": dynamic(
    () => import("@/tools/security/hash-generator/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "security/base64-codec": dynamic(
    () => import("@/tools/security/base64-codec/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "security/text-encryptor": dynamic(
    () => import("@/tools/security/text-encryptor/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "security/password-uuid": dynamic(
    () => import("@/tools/security/password-uuid/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "security/url-html-encoder": dynamic(
    () => import("@/tools/security/url-html-encoder/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "media/image-compressor": dynamic(
    () => import("@/tools/media/image-compressor/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "media/image-watermark": dynamic(
    () => import("@/tools/media/image-watermark/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "media/qr-studio": dynamic(
    () => import("@/tools/media/qr-studio/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "media/ocr-extractor": dynamic(
    () => import("@/tools/media/ocr-extractor/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "media/text-diff": dynamic(
    () => import("@/tools/media/text-diff/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "samples/sample-files": dynamic(
    () => import("@/tools/samples/sample-files/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "converters/json-csv-yaml": dynamic(
    () => import("@/tools/converters/json-csv-yaml/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "converters/image-format": dynamic(
    () => import("@/tools/converters/image-format/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "converters/svg-raster": dynamic(
    () => import("@/tools/converters/svg-raster/Component"),
    { ssr: false, loading: ToolFallback },
  ),
  "media/audio-inspector": dynamic(
    () => import("@/tools/media/audio-inspector/Component"),
    { ssr: false, loading: ToolFallback },
  ),
} as const;

type ToolKey = keyof typeof TOOL_COMPONENTS;

function isToolKey(value: string): value is ToolKey {
  return value in TOOL_COMPONENTS;
}

export function ToolClientBoundary({
  category,
  slug,
  config,
}: {
  category: string;
  slug: string;
  config: ToolConfig;
}) {
  const key = `${category}/${slug}`;
  if (!isToolKey(key)) return null;
  const Component = TOOL_COMPONENTS[key];
  return <Component config={config} />;
}
