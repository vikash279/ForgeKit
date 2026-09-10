import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import type {
  RegisteredTool,
  ToolCategory,
  ToolComponentProps,
  ToolConfig,
} from "@/types/tool";
import { TOOL_CATEGORIES } from "@/types/tool";
import { jsonFormatterConfig } from "@/tools/development/json-formatter/config";
import { regexTesterConfig } from "@/tools/development/regex-tester/config";
import { crontabEvaluatorConfig } from "@/tools/development/crontab-evaluator/config";
import { unixTimestampConfig } from "@/tools/development/unix-timestamp/config";
import { baseConverterConfig } from "@/tools/development/base-converter/config";
import { nginxHtaccessConfig } from "@/tools/development/nginx-htaccess/config";
import { sqlFormatterConfig } from "@/tools/development/sql-formatter/config";
import { codeObfuscatorConfig } from "@/tools/development/code-obfuscator/config";
import { httpSimulatorConfig } from "@/tools/website/http-simulator/config";
import { websocketTesterConfig } from "@/tools/website/websocket-tester/config";
import { dnsPortCheckerConfig } from "@/tools/website/dns-port-checker/config";
import { websiteAssetExtractorConfig } from "@/tools/website/website-asset-extractor/config";
import { hashGeneratorConfig } from "@/tools/security/hash-generator/config";
import { base64CodecConfig } from "@/tools/security/base64-codec/config";
import { textEncryptorConfig } from "@/tools/security/text-encryptor/config";
import { passwordUuidConfig } from "@/tools/security/password-uuid/config";
import { urlHtmlEncoderConfig } from "@/tools/security/url-html-encoder/config";
import { imageCompressorConfig } from "@/tools/media/image-compressor/config";
import { imageWatermarkConfig } from "@/tools/media/image-watermark/config";
import { qrStudioConfig } from "@/tools/media/qr-studio/config";
import { ocrExtractorConfig } from "@/tools/media/ocr-extractor/config";
import { textDiffConfig } from "@/tools/media/text-diff/config";

type ToolLoader = () => Promise<{ default: ComponentType<ToolComponentProps> }>;

function register(config: ToolConfig, loadComponent: ToolLoader): RegisteredTool {
  return { config, loadComponent };
}

export const TOOL_REGISTRY: readonly RegisteredTool[] = [
  register(jsonFormatterConfig, () => import("@/tools/development/json-formatter/Component")),
  register(regexTesterConfig, () => import("@/tools/development/regex-tester/Component")),
  register(crontabEvaluatorConfig, () => import("@/tools/development/crontab-evaluator/Component")),
  register(unixTimestampConfig, () => import("@/tools/development/unix-timestamp/Component")),
  register(baseConverterConfig, () => import("@/tools/development/base-converter/Component")),
  register(nginxHtaccessConfig, () => import("@/tools/development/nginx-htaccess/Component")),
  register(sqlFormatterConfig, () => import("@/tools/development/sql-formatter/Component")),
  register(codeObfuscatorConfig, () => import("@/tools/development/code-obfuscator/Component")),
  register(httpSimulatorConfig, () => import("@/tools/website/http-simulator/Component")),
  register(websocketTesterConfig, () => import("@/tools/website/websocket-tester/Component")),
  register(dnsPortCheckerConfig, () => import("@/tools/website/dns-port-checker/Component")),
  register(websiteAssetExtractorConfig, () => import("@/tools/website/website-asset-extractor/Component")),
  register(hashGeneratorConfig, () => import("@/tools/security/hash-generator/Component")),
  register(base64CodecConfig, () => import("@/tools/security/base64-codec/Component")),
  register(textEncryptorConfig, () => import("@/tools/security/text-encryptor/Component")),
  register(passwordUuidConfig, () => import("@/tools/security/password-uuid/Component")),
  register(urlHtmlEncoderConfig, () => import("@/tools/security/url-html-encoder/Component")),
  register(imageCompressorConfig, () => import("@/tools/media/image-compressor/Component")),
  register(imageWatermarkConfig, () => import("@/tools/media/image-watermark/Component")),
  register(qrStudioConfig, () => import("@/tools/media/qr-studio/Component")),
  register(ocrExtractorConfig, () => import("@/tools/media/ocr-extractor/Component")),
  register(textDiffConfig, () => import("@/tools/media/text-diff/Component")),
] as const;

const toolIndex = new Map(
  TOOL_REGISTRY.map((tool) => [`${tool.config.category}/${tool.config.slug}`, tool]),
);

export function getAllToolConfigs(): ToolConfig[] {
  return TOOL_REGISTRY.map((tool) => tool.config);
}

export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return getAllToolConfigs().filter((tool) => tool.category === category);
}

export function getRegisteredTool(
  category: string,
  slug: string,
): RegisteredTool | undefined {
  return toolIndex.get(`${category}/${slug}`);
}

export function requireRegisteredTool(category: string, slug: string): RegisteredTool {
  const tool = getRegisteredTool(category, slug);
  if (!tool) notFound();
  return tool;
}

export function isToolCategory(value: string): value is ToolCategory {
  return (TOOL_CATEGORIES as readonly string[]).includes(value);
}

export function getStaticToolParams(): { category: ToolCategory; slug: string }[] {
  return getAllToolConfigs().map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}

export function toolHref(config: Pick<ToolConfig, "category" | "slug">): string {
  return `/${config.category}/${config.slug}`;
}
