"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCopy, Download } from "lucide-react";
import { toast } from "sonner";
import { ExecutionBadge } from "@/components/tools/execution-badge";
import { ToolIcon } from "@/components/tools/tool-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadBlob, downloadText } from "@/lib/files";
import { recordRecentTool } from "@/lib/storage";
import {
  generateBinarySample,
  generateCsvSample,
  generateHtmlSample,
  generateJsonSample,
  generateMarkdownSample,
  generateSqlSample,
  generateXmlSample,
  generateYamlSample,
  type BinaryKind,
  type JsonDataset,
  type TableRows,
} from "@/lib/samples";
import { formatBytes } from "@/lib/utils";
import type { ToolComponentProps } from "@/types/tool";

const ROW_OPTIONS: TableRows[] = [10, 100, 1000];
const SIZES = [
  { label: "1MB", bytes: 1_048_576 },
  { label: "5MB", bytes: 5_242_880 },
  { label: "10MB", bytes: 10_485_760 },
  { label: "50MB", bytes: 52_428_800 },
] as const;
const BINARY_KINDS: BinaryKind[] = ["bin", "txt", "pdf", "mp4"];

export default function SampleFilesHub({ config }: ToolComponentProps) {
  const [dataset, setDataset] = useState<JsonDataset>("users");
  const [rows, setRows] = useState<TableRows>(10);
  const [binSize, setBinSize] = useState<(typeof SIZES)[number]["bytes"]>(1_048_576);
  const [pendingKind, setPendingKind] = useState<BinaryKind | null>(null);

  useEffect(() => {
    recordRecentTool({ category: config.category, slug: config.slug, name: config.name });
  }, [config.category, config.name, config.slug]);

  const textCards = useMemo(
    () => [
      { badge: "JSON", name: "Mock users / products / GeoJSON", filename: `${dataset}.json`, mime: "application/json", body: generateJsonSample(dataset, rows) },
      { badge: "CSV", name: `${rows}-row table dump`, filename: `users-${rows}.csv`, mime: "text/csv", body: generateCsvSample(rows) },
      { badge: "SQL", name: `${rows}-row INSERT dump`, filename: `users-${rows}.sql`, mime: "application/sql", body: generateSqlSample(rows) },
      { badge: "YAML", name: "App boilerplate", filename: "config.yaml", mime: "text/yaml", body: generateYamlSample() },
      { badge: "XML", name: "Catalog template", filename: "catalog.xml", mime: "application/xml", body: generateXmlSample() },
      { badge: "HTML", name: "Minimal document", filename: "dummy.html", mime: "text/html", body: generateHtmlSample() },
      { badge: "MD", name: "Markdown fixture", filename: "README.sample.md", mime: "text/markdown", body: generateMarkdownSample() },
    ],
    [dataset, rows],
  );

  const copy = async (body: string) => {
    await navigator.clipboard.writeText(body);
    toast.success("Copied to clipboard");
  };

  const downloadBinary = async (kind: BinaryKind) => {
    setPendingKind(kind);
    try {
      const blob = await generateBinarySample(binSize, kind);
      downloadBlob(`dummy-${formatBytes(binSize).replace(/\s+/g, "")}.${kind}`, blob);
      toast.success("Download started");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not build file.");
    } finally {
      setPendingKind(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 border-b pb-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg border bg-accent p-2 text-accent-foreground">
            <ToolIcon name={config.icon} className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">{config.name}</h1>
              <ExecutionBadge target={config.executionTarget} />
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="w-44">
            <Label>JSON dataset</Label>
            <Select value={dataset} onValueChange={(value) => setDataset(value as JsonDataset)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="users">User records</SelectItem>
                <SelectItem value="products">E-commerce products</SelectItem>
                <SelectItem value="geojson">GeoJSON points</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-36">
            <Label>Table rows</Label>
            <Select value={String(rows)} onValueChange={(value) => setRows(Number(value) as TableRows)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ROW_OPTIONS.map((count) => (
                  <SelectItem key={count} value={String(count)}>{count} rows</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Dummy data & code</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {textCards.map((card) => (
            <Card key={card.filename}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{card.badge}</Badge>
                  <span className="text-xs text-muted-foreground">{formatBytes(new Blob([card.body]).size)}</span>
                </div>
                <CardTitle className="text-base">{card.name}</CardTitle>
                <CardDescription>{card.filename}</CardDescription>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Button size="sm" variant="outline" onClick={() => void copy(card.body)}>
                    <ClipboardCopy /> Copy Contents
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadText(card.filename, card.body, card.mime)}>
                    <Download /> Download File
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Binary dummy files</h2>
          <div className="w-36">
            <Label>Size</Label>
            <Select value={String(binSize)} onValueChange={(value) => setBinSize(Number(value) as (typeof SIZES)[number]["bytes"])}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SIZES.map((size) => (
                  <SelectItem key={size.bytes} value={String(size.bytes)}>{size.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {BINARY_KINDS.map((kind) => (
            <Card key={kind}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">.{kind}</Badge>
                  <span className="text-xs text-muted-foreground">{formatBytes(binSize)}</span>
                </div>
                <CardTitle className="text-base">Random {kind.toUpperCase()}</CardTitle>
                <CardDescription>Upload-limit fixture generated as a Blob.</CardDescription>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 w-fit"
                  disabled={pendingKind !== null}
                  onClick={() => void downloadBinary(kind)}
                >
                  <Download /> {pendingKind === kind ? "Building…" : "Download File"}
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
