"use client";

import { useRef, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { downloadBlob } from "@/lib/files";
import { formatBytes } from "@/lib/utils";
import type { ToolComponentProps } from "@/types/tool";

type OutMime = "image/png" | "image/jpeg" | "image/webp" | "image/avif";

const EXT: Record<OutMime, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

export default function ImageFormatTool({ config }: ToolComponentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [mime, setMime] = useState<OutMime>("image/webp");
  const [quality, setQuality] = useState(0.85);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const load = (next: File) => {
    setFile(next);
    setError(null);
    setSourceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(next);
    });
  };

  const convert = async () => {
    if (!file) {
      setError("Upload an image first.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is not available.");
      context.drawImage(bitmap, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, mime, quality);
      });
      if (!blob) throw new Error(`This browser could not encode ${mime}. Try WEBP or PNG.`);
      setResultSize(blob.size);
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={resultUrl ?? ""}
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
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const next = event.target.files?.[0];
                  if (next) load(next);
                }}
              />
              <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
                Upload image
              </Button>
              <Button size="sm" onClick={() => void convert()} disabled={pending}>
                {pending ? "Converting…" : "Convert"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!resultUrl}
                onClick={async () => {
                  if (!resultUrl) return;
                  const blob = await fetch(resultUrl).then((response) => response.blob());
                  downloadBlob(`converted.${EXT[mime]}`, blob);
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
          <PaneHeader title="Source" extra={file ? <span className="text-xs">{formatBytes(file.size)}</span> : null} />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <div>
              <Label>Output</Label>
              <Select value={mime} onValueChange={(value) => setMime(value as OutMime)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image/png">PNG</SelectItem>
                  <SelectItem value="image/jpeg">JPEG</SelectItem>
                  <SelectItem value="image/webp">WEBP</SelectItem>
                  <SelectItem value="image/avif">AVIF</SelectItem>
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
                onValueChange={(value) => setQuality(value[0] ?? 0.85)}
              />
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg border bg-muted/30 p-3">
              {sourceUrl ? <img src={sourceUrl} alt="Source" className="max-h-64 max-w-full object-contain" /> : <p className="text-sm text-muted-foreground">Upload a bitmap.</p>}
            </div>
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Converted" extra={resultSize ? <span className="text-xs">{formatBytes(resultSize)}</span> : null} />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg border bg-muted/30 p-3">
              {resultUrl ? <img src={resultUrl} alt="Converted" className="max-h-64 max-w-full object-contain" /> : <p className="text-sm text-muted-foreground">Result appears here.</p>}
            </div>
          </div>
        </>
      }
    />
  );
}
