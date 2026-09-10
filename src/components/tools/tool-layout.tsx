"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ExecutionBadge } from "@/components/tools/execution-badge";
import { ToolIcon } from "@/components/tools/tool-icon";
import { recordRecentTool } from "@/lib/storage";
import type { ToolConfig } from "@/types/tool";

interface ToolLayoutProps {
  config: ToolConfig;
  toolbar: ReactNode;
  input: ReactNode;
  output: ReactNode;
  stacked?: boolean;
  below?: ReactNode;
}

function subscribeMobile(onChange: () => void): () => void {
  const query = window.matchMedia("(max-width: 900px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function ToolLayout({
  config,
  toolbar,
  input,
  output,
  stacked = false,
  below,
}: ToolLayoutProps) {
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia("(max-width: 900px)").matches,
    () => false,
  );
  const orientation = stacked || isMobile ? "vertical" : "horizontal";

  useEffect(() => {
    recordRecentTool({
      category: config.category,
      slug: config.slug,
      name: config.name,
    });
  }, [config.category, config.name, config.slug]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <header className="flex flex-col gap-2 border-b pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg border bg-accent p-2 text-accent-foreground">
              <ToolIcon name={config.icon} className="size-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight">{config.name}</h1>
                <ExecutionBadge target={config.executionTarget} />
              </div>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>
        </div>
        {toolbar}
      </header>
      <div className="min-h-[28rem] flex-1 overflow-hidden rounded-xl border">
        <ResizablePanelGroup orientation={orientation} className="h-full min-h-[28rem]">
          <ResizablePanel defaultSize="50%" minSize="24%" className="min-h-0">
            <div className="flex h-full min-h-0 flex-col">{input}</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="50%" minSize="24%" className="min-h-0">
            <div className="flex h-full min-h-0 flex-col">{output}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {below}
    </div>
  );
}

export function PaneHeader({ title, extra }: { title: string; extra?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-2">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      {extra}
    </div>
  );
}
