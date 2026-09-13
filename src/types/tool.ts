import type { ComponentType } from "react";

export const EXECUTION_TARGETS = ["CLIENT", "SERVER_PROXY", "AI_REMOTE"] as const;
export type ExecutionTarget = (typeof EXECUTION_TARGETS)[number];

export const TOOL_CATEGORIES = [
  "development",
  "samples",
  "converters",
  "website",
  "security",
  "media",
] as const;
export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export const TOOL_IO_KINDS = [
  "text",
  "json",
  "code",
  "file",
  "binary",
  "image",
] as const;
export type ToolIoKind = (typeof TOOL_IO_KINDS)[number];

export interface ToolIoField {
  id: string;
  label: string;
  kind: ToolIoKind;
  description?: string;
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export type ToolIconName =
  | "Braces"
  | "Regex"
  | "Clock"
  | "Timer"
  | "Binary"
  | "Server"
  | "Database"
  | "ShieldOff"
  | "Globe"
  | "Radio"
  | "Network"
  | "FolderTree"
  | "Fingerprint"
  | "FileCode"
  | "Lock"
  | "KeyRound"
  | "Link2"
  | "Image"
  | "Stamp"
  | "QrCode"
  | "ScanText"
  | "Diff"
  | "Files"
  | "ArrowLeftRight"
  | "Images"
  | "FileImage"
  | "AudioLines";

export interface ToolConfig {
  slug: string;
  category: ToolCategory;
  name: string;
  shortName: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  executionTarget: ExecutionTarget;
  icon: ToolIconName;
  inputs: ToolIoField[];
  outputs: ToolIoField[];
  sampleData?: string;
  relatedSlugs?: string[];
  faq?: ToolFaqItem[];
  howToSteps?: string[];
  targetKeywords?: string[];
  featureNotes?: string[];
}

export interface ToolComponentProps {
  config: ToolConfig;
}

export interface RegisteredTool {
  config: ToolConfig;
  loadComponent: () => Promise<{ default: ComponentType<ToolComponentProps> }>;
}

export interface ParseIssue {
  message: string;
  line?: number;
  column?: number;
}

export interface CategoryMeta {
  id: ToolCategory;
  label: string;
  description: string;
  href: `/${ToolCategory}`;
}

export const CATEGORY_META: Record<ToolCategory, CategoryMeta> = {
  development: {
    id: "development",
    label: "Development",
    description: "Formatters, converters, regex, SQL, and local code utilities.",
    href: "/development",
  },
  website: {
    id: "website",
    label: "Network & Webmaster",
    description: "HTTP, WebSocket, DNS, ports, and public site inspection.",
    href: "/website",
  },
  security: {
    id: "security",
    label: "Security & Encoders",
    description: "Hashes, codecs, encryption, passwords, and URI entities.",
    href: "/security",
  },
  samples: {
    id: "samples",
    label: "Sample Files",
    description: "Dummy JSON, CSV, SQL, and binary files generated in the browser.",
    href: "/samples",
  },
  converters: {
    id: "converters",
    label: "Converters",
    description: "JSON, CSV, YAML, image, and SVG conversions that stay on-device.",
    href: "/converters",
  },
  media: {
    id: "media",
    label: "Media & AI",
    description: "Compress, watermark, QR, OCR, audio, and visual text diffs.",
    href: "/media",
  },
};
