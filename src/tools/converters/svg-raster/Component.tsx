"use client";

import { useRef, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { ToolErrorBanner } from "@/components/tools/tool-error-banner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { downloadBlob } from "@/lib/files";
import { canvasToPng, pngBlobsToIco } from "@/lib/ico";
import type { ToolComponentProps } from "@/types/tool";

const ICO_SIZES = [16, 32, 48];

export default function SvgRasterTool({ config }: ToolComponentProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(config.sampleData ?? "");
  const [width, setWidth] = useState(256);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const rasterize = async (targetWidth: number): Promise<HTMLCanvasElement> => {
    const blob = new Blob([input], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    try {
      const image = await loadImage(url);
      const ratio = image.height / image.width || 1;
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = Math.max(1, Math.round(targetWidth * ratio));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is not available.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const exportPng = async () => {
    setPending(true);
    setError(null);
    try {
      const canvas = await rasterize(width);
      const blob = await canvasToPng(canvas);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      downloadBlob(`icon-${width}.png`, blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "SVG rasterization failed.");
    } finally {
      setPending(false);
    }
  };

  const exportIco = async () => {
    setPending(true);
    setError(null);
    try {
      const frames: { size: number; blob: Blob }[] = [];
      for (const size of ICO_SIZES) {
        const canvas = await rasterize(size);
        frames.push({ size, blob: await canvasToPng(canvas) });
      }
      const ico = await pngBlobsToIco(frames);
      downloadBlob("favicon.ico", ico);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(frames[frames.length - 1]!.blob);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "ICO export failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={input}
          downloadName="source.svg"
          accept=".svg,image/svg+xml,text/plain"
          onClear={() => setInput("")}
          onSample={() => setInput(config.sampleData ?? "")}
          onUploadText={(value) => setInput(value)}
          extra={
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".svg,image/svg+xml"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (file) setInput(await file.text());
                }}
              />
              <Button size="sm" onClick={() => void exportPng()} disabled={pending || !input.trim()}>
                {pending ? "Rasterizing…" : "Download PNG"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => void exportIco()} disabled={pending || !input.trim()}>
                Download ICO
              </Button>
            </>
          }
        />
      }
      input={
        <>
          <PaneHeader title="SVG" />
          <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
            <div>
              <Label>PNG width {width}px</Label>
              <Slider
                className="mt-3"
                min={16}
                max={1024}
                step={16}
                value={[width]}
                onValueChange={(value) => setWidth(value[0] ?? 256)}
              />
            </div>
            <Textarea className="min-h-0 flex-1 font-mono text-xs" value={input} onChange={(event) => setInput(event.target.value)} />
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Raster preview" />
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <ToolErrorBanner error={error ? { message: error } : null} />
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-lg border bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-size-[16px_16px] bg-position-[0_0,0_8px,8px_-8px,-8px_0] dark:bg-muted/40">
              {preview ? <img src={preview} alt="Rasterized SVG" className="max-h-72 max-w-full" /> : <p className="rounded bg-background/80 px-2 py-1 text-sm text-muted-foreground">Export PNG or ICO to preview.</p>}
            </div>
          </div>
        </>
      }
    />
  );
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not draw this SVG. Check markup and CORS."));
    image.src = url;
  });
}
