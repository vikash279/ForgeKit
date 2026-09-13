export async function pngBlobsToIco(pngs: { size: number; blob: Blob }[]): Promise<Blob> {
  const images = await Promise.all(
    pngs.map(async (entry) => ({
      size: entry.size,
      bytes: new Uint8Array(await entry.blob.arrayBuffer()),
    })),
  );

  const headerSize = 6 + images.length * 16;
  let offset = headerSize;
  const entries = images.map((image) => {
    const entry = { ...image, offset };
    offset += image.bytes.byteLength;
    return entry;
  });

  const output = new Uint8Array(offset);
  const view = new DataView(output.buffer);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, entries.length, true);

  entries.forEach((entry, index) => {
    const base = 6 + index * 16;
    output[base] = entry.size >= 256 ? 0 : entry.size;
    output[base + 1] = entry.size >= 256 ? 0 : entry.size;
    output[base + 2] = 0;
    output[base + 3] = 0;
    view.setUint16(base + 4, 1, true);
    view.setUint16(base + 6, 32, true);
    view.setUint32(base + 8, entry.bytes.byteLength, true);
    view.setUint32(base + 12, entry.offset, true);
    output.set(entry.bytes, entry.offset);
  });

  return new Blob([output], { type: "image/x-icon" });
}

export async function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
  if (!blob) throw new Error("Could not encode PNG.");
  return blob;
}
