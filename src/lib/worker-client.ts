"use client";

export interface WorkerRequestBase {
  id: string;
}

export interface WorkerOk<T> {
  id: string;
  ok: true;
  result: T;
}

export interface WorkerErr {
  id: string;
  ok: false;
  error: string;
}

export type WorkerResponse<T> = WorkerOk<T> | WorkerErr;

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export function createWorkerClient<
  TReq extends WorkerRequestBase,
  TRes extends WorkerResponse<unknown>,
>(factory: () => Worker) {
  let worker: Worker | null = null;
  const pending = new Map<
    string,
    {
      resolve: (value: Extract<TRes, { ok: true }>) => void;
      reject: (reason: Error) => void;
    }
  >();

  const ensure = (): Worker => {
    if (typeof window === "undefined") {
      throw new Error("Web Workers are only available in the browser.");
    }
    if (worker) return worker;
    worker = factory();
    worker.onmessage = (event: MessageEvent<TRes>) => {
      const payload = event.data;
      const waiter = pending.get(payload.id);
      if (!waiter) return;
      pending.delete(payload.id);
      if (payload.ok) waiter.resolve(payload as Extract<TRes, { ok: true }>);
      else waiter.reject(new Error(payload.error));
    };
    worker.onerror = (event) => {
      const error = new Error(event.message || "Worker failed.");
      for (const waiter of pending.values()) waiter.reject(error);
      pending.clear();
    };
    return worker;
  };

  return {
    call(payload: DistributiveOmit<TReq, "id">, transfer?: Transferable[]) {
      const id = crypto.randomUUID();
      const request = { ...payload, id } as unknown as TReq;
      return new Promise<Extract<TRes, { ok: true }>>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ensure().postMessage(request, transfer ?? []);
      });
    },
    terminate() {
      worker?.terminate();
      worker = null;
      pending.clear();
    },
  };
}
