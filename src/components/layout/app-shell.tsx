"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SITE_NAME } from "@/lib/site";
import { useHydrated } from "@/hooks/use-hydrated";

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-full">
      {hydrated ? <CommandPalette /> : null}
      <aside className="sticky top-0 hidden h-svh w-72 shrink-0 flex-col border-r bg-sidebar md:flex">
        <Brand />
        {hydrated ? <SidebarNav /> : <div className="flex-1" />}
      </aside>
      {hydrated && mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex h-full w-72 flex-col bg-sidebar shadow-xl">
            <Brand />
            <SidebarNav />
          </aside>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
          {hydrated ? (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden max-w-sm flex-1 justify-start gap-2 text-muted-foreground sm:inline-flex"
                onClick={() => {
                  window.dispatchEvent(new Event("forgekit:command-palette"));
                }}
              >
                <Search className="size-3.5" />
                Search tools
                <kbd className="ml-auto rounded border bg-muted px-1.5 text-[10px]">
                  Ctrl K
                </kbd>
              </Button>
              <div className="ml-auto flex items-center gap-1">
                <ThemeToggle />
              </div>
            </>
          ) : (
            <div className="ml-auto size-7" />
          )}
        </header>
        <main className="flex min-h-0 flex-1 flex-col p-4">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 border-b px-4 py-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="size-4" />
      </span>
      <span>
        <span className="block text-sm font-semibold">{SITE_NAME}</span>
        <span className="block text-[11px] text-muted-foreground">
          Local-first utilities
        </span>
      </span>
    </Link>
  );
}
