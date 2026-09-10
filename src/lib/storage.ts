const RECENT_KEY = "forgekit:recent-tools";
const MAX_RECENT = 12;

export interface RecentToolRef {
  category: string;
  slug: string;
  name: string;
  viewedAt: number;
}

export function readRecentTools(): RecentToolRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentToolRef);
  } catch {
    return [];
  }
}

export function recordRecentTool(entry: Omit<RecentToolRef, "viewedAt">): RecentToolRef[] {
  const next: RecentToolRef[] = [
    { ...entry, viewedAt: Date.now() },
    ...readRecentTools().filter(
      (item) => !(item.category === entry.category && item.slug === entry.slug),
    ),
  ].slice(0, MAX_RECENT);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("forgekit:recent"));
  return next;
}

export function subscribeRecentTools(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener("forgekit:recent", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("forgekit:recent", onChange);
  };
}

export function recentToolsSnapshot(): string {
  return window.localStorage.getItem(RECENT_KEY) ?? "[]";
}

export function parseRecentSnapshot(raw: string): RecentToolRef[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentToolRef);
  } catch {
    return [];
  }
}

function isRecentToolRef(value: unknown): value is RecentToolRef {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.category === "string" &&
    typeof record.slug === "string" &&
    typeof record.name === "string" &&
    typeof record.viewedAt === "number"
  );
}
