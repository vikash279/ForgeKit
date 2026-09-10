"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { ToolIcon } from "@/components/tools/tool-icon";
import { getAllToolConfigs, getToolsByCategory, toolHref } from "@/registry";
import { CATEGORY_META, TOOL_CATEGORIES } from "@/types/tool";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("forgekit:command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("forgekit:command-palette", onOpen);
    };
  }, []);

  return open ? (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search tools">
      <Command>
        <CommandInput placeholder="Jump to any tool…" />
        <CommandList>
          <CommandEmpty>No matching tools.</CommandEmpty>
          {TOOL_CATEGORIES.map((category) => (
            <CommandGroup key={category} heading={CATEGORY_META[category].label}>
              {getToolsByCategory(category).map((tool) => (
                <CommandItem
                  key={tool.slug}
                  value={`${tool.name} ${tool.slug} ${tool.keywords.join(" ")}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(toolHref(tool));
                  }}
                >
                  <ToolIcon name={tool.icon} className="size-4" />
                  <span>{tool.name}</span>
                  <CommandShortcut>{tool.executionTarget}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  ) : null;
}

export const ALL_TOOLS_COUNT = getAllToolConfigs().length;
