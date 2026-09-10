"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock3, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolIcon } from "@/components/tools/tool-icon";
import { ExecutionBadge } from "@/components/tools/execution-badge";
import { getAllToolConfigs, getToolsByCategory, toolHref } from "@/registry";
import { CATEGORY_META, TOOL_CATEGORIES, type ToolCategory } from "@/types/tool";
import {
  parseRecentSnapshot,
  recentToolsSnapshot,
  subscribeRecentTools,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const recentRaw = useSyncExternalStore(
    subscribeRecentTools,
    recentToolsSnapshot,
    () => "[]",
  );
  const recent = useMemo(() => parseRecentSnapshot(recentRaw), [recentRaw]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const all = getAllToolConfigs();
    if (!needle) return all;
    return all.filter((tool) =>
      `${tool.name} ${tool.slug} ${tool.keywords.join(" ")} ${tool.category}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <div className="relative">
          <Search className="absolute top-2 left-2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools"
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {recent.length > 0 && !query ? (
            <div className="mb-3">
              <p className="flex items-center gap-1 px-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                <Clock3 className="size-3" />
                Recent
              </p>
              <ul className="space-y-0.5">
                {recent.slice(0, 6).map((item) => (
                  <li key={`${item.category}/${item.slug}`}>
                    <Link
                      href={`/${item.category}/${item.slug}`}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent",
                        pathname === `/${item.category}/${item.slug}` &&
                          "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {query ? (
            <ul className="space-y-0.5">
              {filtered.map((tool) => (
                <li key={`${tool.category}/${tool.slug}`}>
                  <ToolLink
                    href={toolHref(tool)}
                    active={pathname === toolHref(tool)}
                    icon={tool.icon}
                    name={tool.shortName}
                    target={tool.executionTarget}
                  />
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No tools match.
                </li>
              ) : null}
            </ul>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={[...TOOL_CATEGORIES]}
            >
              {TOOL_CATEGORIES.map((category: ToolCategory) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="px-2 text-xs tracking-wide uppercase">
                    {CATEGORY_META[category].label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-0.5">
                      {getToolsByCategory(category).map((tool) => (
                        <li key={tool.slug}>
                          <ToolLink
                            href={toolHref(tool)}
                            active={pathname === toolHref(tool)}
                            icon={tool.icon}
                            name={tool.shortName}
                            target={tool.executionTarget}
                          />
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ToolLink({
  href,
  active,
  icon,
  name,
  target,
}: {
  href: string;
  active: boolean;
  icon: Parameters<typeof ToolIcon>[0]["name"];
  name: string;
  target: Parameters<typeof ExecutionBadge>[0]["target"];
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
    >
      <ToolIcon name={icon} className="size-3.5 shrink-0 opacity-70" />
      <span className="min-w-0 flex-1 truncate">{name}</span>
      <ExecutionBadge target={target} />
    </Link>
  );
}
