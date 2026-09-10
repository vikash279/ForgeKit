"use client";

import type { CryptoWorkerRequest, CryptoWorkerResponse, DiffWorkerRequest, DiffWorkerResponse, ImageWorkerRequest, ImageWorkerResponse } from "@/lib/crypto/protocol";
import { createWorkerClient } from "@/lib/worker-client";

export function createCryptoWorker() {
  return createWorkerClient<CryptoWorkerRequest, CryptoWorkerResponse>(
    () => new Worker(new URL("../workers/crypto.worker.ts", import.meta.url), { type: "module" }),
  );
}

export function createImageWorker() {
  return createWorkerClient<ImageWorkerRequest, ImageWorkerResponse>(
    () => new Worker(new URL("../workers/image.worker.ts", import.meta.url), { type: "module" }),
  );
}

export function createDiffWorker() {
  return createWorkerClient<DiffWorkerRequest, DiffWorkerResponse>(
    () => new Worker(new URL("../workers/diff.worker.ts", import.meta.url), { type: "module" }),
  );
}
