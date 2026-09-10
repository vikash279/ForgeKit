"use client";

import {
  Binary,
  Braces,
  Clock,
  Database,
  Diff,
  FileCode,
  Fingerprint,
  FolderTree,
  Globe,
  Image,
  KeyRound,
  Link2,
  Lock,
  Network,
  QrCode,
  Radio,
  Regex,
  ScanText,
  Server,
  ShieldOff,
  Stamp,
  Timer,
  type LucideIcon,
} from "lucide-react";
import type { ToolIconName } from "@/types/tool";

const ICONS: Record<ToolIconName, LucideIcon> = {
  Braces,
  Regex,
  Clock,
  Timer,
  Binary,
  Server,
  Database,
  ShieldOff,
  Globe,
  Radio,
  Network,
  FolderTree,
  Fingerprint,
  FileCode,
  Lock,
  KeyRound,
  Link2,
  Image,
  Stamp,
  QrCode,
  ScanText,
  Diff,
};

export function ToolIcon({
  name,
  className,
}: {
  name: ToolIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} />;
}
