export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";
export type CipherAlgorithm = "AES-GCM" | "DES";

export type CryptoWorkerRequest =
  | {
      id: string;
      action: "hash";
      algorithm: HashAlgorithm;
      bytes: ArrayBuffer;
    }
  | {
      id: string;
      action: "encrypt";
      algorithm: CipherAlgorithm;
      plaintext: string;
      passphrase: string;
    }
  | {
      id: string;
      action: "decrypt";
      algorithm: CipherAlgorithm;
      payload: string;
      passphrase: string;
    };

export type CryptoWorkerResponse =
  | { id: string; ok: true; result: string }
  | { id: string; ok: false; error: string };

export type ImageWorkerRequest = {
  id: string;
  action: "compress";
  bitmap: ImageBitmap;
  mime: "image/jpeg" | "image/png" | "image/webp";
  quality: number;
  maxWidth: number;
};

export type ImageWorkerResponse =
  | {
      id: string;
      ok: true;
      result: { blob: Blob; width: number; height: number };
    }
  | { id: string; ok: false; error: string };

export type DiffWorkerRequest = {
  id: string;
  action: "diff";
  left: string;
  right: string;
};

export interface DiffLine {
  kind: "equal" | "add" | "remove";
  leftNumber: number | null;
  rightNumber: number | null;
  text: string;
}

export type DiffWorkerResponse =
  | { id: string; ok: true; result: DiffLine[] }
  | { id: string; ok: false; error: string };
