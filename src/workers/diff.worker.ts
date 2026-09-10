/// <reference lib="es2020" />
/// <reference lib="webworker" />

import type {
  DiffLine,
  DiffWorkerRequest,
  DiffWorkerResponse,
} from "@/lib/crypto/protocol";

function lcsTable(a: string[], b: string[]): number[][] {
  const rows = a.length;
  const cols = b.length;
  const table: number[][] = Array.from({ length: rows + 1 }, () =>
    Array.from({ length: cols + 1 }, () => 0),
  );
  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      table[i]![j] =
        a[i] === b[j] ? (table[i + 1]![j + 1] ?? 0) + 1 : Math.max(table[i + 1]![j] ?? 0, table[i]![j + 1] ?? 0);
    }
  }
  return table;
}

function diffLines(left: string, right: string): DiffLine[] {
  const a = left.split(/\r?\n/);
  const b = right.split(/\r?\n/);
  const table = lcsTable(a, b);
  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let leftNumber = 1;
  let rightNumber = 1;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      lines.push({
        kind: "equal",
        leftNumber: leftNumber++,
        rightNumber: rightNumber++,
        text: a[i] ?? "",
      });
      i += 1;
      j += 1;
    } else if ((table[i]![j + 1] ?? 0) >= (table[i + 1]![j] ?? 0)) {
      lines.push({
        kind: "add",
        leftNumber: null,
        rightNumber: rightNumber++,
        text: b[j] ?? "",
      });
      j += 1;
    } else {
      lines.push({
        kind: "remove",
        leftNumber: leftNumber++,
        rightNumber: null,
        text: a[i] ?? "",
      });
      i += 1;
    }
  }
  while (i < a.length) {
    lines.push({
      kind: "remove",
      leftNumber: leftNumber++,
      rightNumber: null,
      text: a[i++] ?? "",
    });
  }
  while (j < b.length) {
    lines.push({
      kind: "add",
      leftNumber: null,
      rightNumber: rightNumber++,
      text: b[j++] ?? "",
    });
  }
  return lines;
}

self.onmessage = (event: MessageEvent<DiffWorkerRequest>) => {
  const request = event.data;
  try {
    const response: DiffWorkerResponse = {
      id: request.id,
      ok: true,
      result: diffLines(request.left, request.right),
    };
    self.postMessage(response);
  } catch (error) {
    const response: DiffWorkerResponse = {
      id: request.id,
      ok: false,
      error: error instanceof Error ? error.message : "Diff worker failed.",
    };
    self.postMessage(response);
  }
};
