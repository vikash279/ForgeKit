"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadBlob } from "@/lib/files";
import { formatBytes as formatSize } from "@/lib/utils";
import { createImageWorker } from "@/lib/workers";
import type { ToolComponentProps } from "@/types/tool";

type Mime = "image/jpeg" | "image/png" | "image/webp";

export default function ImageCompressorTool({ config }: ToolComponentProps) {
  const worker = useMemo(() => createImageWorker(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [sourceSize, setSourceSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [mime, setMime] = useState<Mime>("image/webp");
  const [quality, setQuality] = useState(0.75);
  const [maxWidth, setMaxWidth] = useState(1600);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => () => worker.terminate(), [worker]);

  const load = (next: File) => {
    setFile(next);
    setSourceSize(next.size);
    setSourceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(next);
    });
  };

  const compress = async () => {
    if (!file) {
      setError("Upload an image first.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const bitmap = await createImageBitmap(file);
      const response = await worker.call(
        {
          action: "compress",
          bitmap,
          mime,
          quality,
          maxWidth,
        },
        [bitmap],
      );
      const blob = response.result.blob;
      setResultSize(blob.size);
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compression failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={resultUrl ? `compressed:${resultSize}` : ""}
          onClear={() => {
            setFile(null);
            setSourceUrl(null);
            setResultUrl(null);
            setError(null);
          }}
          extra={
            <>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  const next = event.target.files?.[0];
                  if (next) load(next);
                }}
              />
              <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                Upload
              </Button>
              <Button size="sm" onClick={() => void compress()} disabled={pending}>
                {pending ? "Compressing…" : "Compress"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!resultUrl}
                onClick={async () => {
                  if (!resultUrl) return;
                  const blob = await fetch(resultUrl).then((response) => response.blob());
                  downloadBlob(`compressed.${mime.split("/")[1]}`, blob);
                }}
              >
                Download
              </Button>
            </>
          }
        />
      }
      input={
        <>
          <PaneHeader title="Original" extra={sourceSize ? <span>{formatSize(sourceSize)}</span> : null} />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label>Format</Label>
                <Select value={mime} onValueChange={(value) => setMime(value as Mime)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">WebP</SelectItem>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quality {Math.round(quality * 100)}%</Label>
                <Slider
                  className="mt-3"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={[quality]}
                  onValueChange={(value) => setQuality(value[0] ?? 0.75)}
                />
              </div>
              <div>
                <Label>Max width {maxWidth}px</Label>
                <Slider
                  className="mt-3"
                  min={320}
                  max={2400}
                  step={80}
                  value={[maxWidth]}
                  onValueChange={(value) => setMaxWidth(value[0] ?? 1600)}
                />
              </div>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg border bg-muted/30 p-3">
              {sourceUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sourceUrl} alt="Original" className="max-h-80 object-contain" />
              ) : (
                <p className="text-sm text-muted-foreground">Drop or upload a PNG, JPEG, or WebP file.</p>
              )}
            </div>
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Compressed" extra={resultSize ? <span>{formatSize(resultSize)}</span> : null} />
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-3">
            {resultUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resultUrl} alt="Compressed" className="max-h-[28rem] object-contain" />
            ) : (
              <p className="text-sm text-muted-foreground">Run compression to preview the result.</p>
            )}
          </div>
        </>
      }
    />
  );
}
