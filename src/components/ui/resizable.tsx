"use client";

import type { ComponentProps } from "react";
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
} from "react-resizable-panels";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: GroupProps) {
  return (
    <Group
      orientation={orientation}
      className={cn(
        "flex h-full w-full",
        orientation === "vertical" && "flex-col",
        className,
      )}
      {...props}
    />
  );
}

const ResizablePanel = Panel;

function ResizableHandle({
  withHandle = false,
  className,
  ...props
}: ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  return (
    <Separator
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:-translate-y-1/2",
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div className="z-10 flex h-8 w-3 items-center justify-center rounded-sm border bg-border">
          <span className="h-4 w-px bg-muted-foreground/50" />
        </div>
      ) : null}
    </Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
