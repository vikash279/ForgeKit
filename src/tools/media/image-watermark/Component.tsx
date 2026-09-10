"use client";

import { useRef, useState } from "react";
import { ToolLayout, PaneHeader } from "@/components/tools/tool-layout";
import { ToolToolbar } from "@/components/tools/tool-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadBlob } from "@/lib/files";
import type { ToolComponentProps } from "@/types/tool";

const PRESETS: Record<string, [number, number]> = {
  original: [0, 0],
  "1:1": [1, 1],
  "16:9": [16, 9],
  "4:5": [4, 5],
  "9:16": [9, 16],
};

export default function ImageWatermarkTool({ config }: ToolComponentProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("ForgeKit");
  const [preset, setPreset] = useState("original");
  const [preview, setPreview] = useState<string | null>(null);
  const [source, setSource] = useState<HTMLImageElement | null>(null);

  const render = (image: HTMLImageElement, nextText = text, nextPreset = preset) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [aw, ah] = PRESETS[nextPreset] ?? [0, 0];
    let sx = 0;
    let sy = 0;
    let sw = image.width;
    let sh = image.height;
    if (aw && ah) {
      const target = aw / ah;
      const current = image.width / image.height;
      if (current > target) {
        sw = Math.round(image.height * target);
        sx = Math.round((image.width - sw) / 2);
      } else {
        sh = Math.round(image.width / target);
        sy = Math.round((image.height - sh) / 2);
      }
    }
    canvas.width = sw;
    canvas.height = sh;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    context.fillStyle = "rgba(255,255,255,0.72)";
    context.font = `${Math.max(18, Math.round(sw / 18))}px sans-serif`;
    context.fillText(nextText, 24, sh - 28);
    setPreview(canvas.toDataURL("image/png"));
  };

  return (
    <ToolLayout
      config={config}
      toolbar={
        <ToolToolbar
          output={preview ?? ""}
          onClear={() => setPreview(null)}
          extra={
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  const image = new Image();
                  image.onload = () => {
                    setSource(image);
                    render(image);
                  };
                  image.src = URL.createObjectURL(file);
                }}
              />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!preview}
                onClick={async () => {
                  if (!preview) return;
                  downloadBlob("watermarked.png", await fetch(preview).then((response) => response.blob()));
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
          <PaneHeader title="Source & stamp" />
          <div className="flex flex-col gap-3 p-3">
            <div>
              <Label>Watermark text</Label>
              <Input
                className="mt-1"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  if (source) render(source, event.target.value, preset);
                }}
              />
            </div>
            <div>
              <Label>Aspect preset</Label>
              <Select
                value={preset}
                onValueChange={(value) => {
                  setPreset(value);
                  if (source) render(source, text, value);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(PRESETS).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </>
      }
      output={
        <>
          <PaneHeader title="Preview" />
          <div className="flex flex-1 items-center justify-center p-3">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Watermarked" className="max-h-[28rem] object-contain" />
            ) : (
              <p className="text-sm text-muted-foreground">Upload an image to stamp it.</p>
            )}
          </div>
        </>
      }
    />
  );
}
