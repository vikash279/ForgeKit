/// <reference lib="es2020" />
/// <reference lib="webworker" />

import type { ImageWorkerRequest, ImageWorkerResponse } from "@/lib/crypto/protocol";

self.onmessage = async (event: MessageEvent<ImageWorkerRequest>) => {
  const request = event.data;
  try {
    const { bitmap, mime, quality, maxWidth } = request;
    const scale = bitmap.width > maxWidth ? maxWidth / bitmap.width : 1;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("OffscreenCanvas is not available.");
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await canvas.convertToBlob({
      type: mime,
      quality: mime === "image/png" ? undefined : quality,
    });
    bitmap.close();
    const response: ImageWorkerResponse = {
      id: request.id,
      ok: true,
      result: { blob, width, height },
    };
    self.postMessage(response);
  } catch (error) {
    const response: ImageWorkerResponse = {
      id: request.id,
      ok: false,
      error: error instanceof Error ? error.message : "Image worker failed.",
    };
    self.postMessage(response);
  }
};
