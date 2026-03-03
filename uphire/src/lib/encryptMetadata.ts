/**
 * OAuth token encryption helper for tenant_job_board_licenses.metadata.
 * Uses Web Crypto API (AES-GCM). Key must be stored server-side (e.g. env ENCRYPTION_KEY).
 *
 * For production: use AWS KMS or similar. This is a client-side compatible helper
 * for when encryption/decryption runs in a secure server context.
 */

const ALG = "AES-GCM";
const KEY_LEN = 256;
const IV_LEN = 12;
const TAG_LEN = 128;

export async function encryptMetadata(plain: Record<string, unknown>, keyHex: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBuffer(keyHex),
    { name: ALG, length: KEY_LEN },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encoded = new TextEncoder().encode(JSON.stringify(plain));
  const cipher = await crypto.subtle.encrypt(
    { name: ALG, iv, tagLength: TAG_LEN },
    key,
    encoded
  );
  const combined = new Uint8Array(iv.length + cipher.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(cipher), iv.length);
  return bufferToBase64(combined);
}

export async function decryptMetadata(cipherBase64: string, keyHex: string): Promise<Record<string, unknown>> {
  const key = await crypto.subtle.importKey(
    "raw",
    hexToBuffer(keyHex),
    { name: ALG, length: KEY_LEN },
    false,
    ["decrypt"]
  );
  const combined = base64ToBuffer(cipherBase64);
  const iv = combined.slice(0, IV_LEN);
  const cipher = combined.slice(IV_LEN);
  const decrypted = await crypto.subtle.decrypt(
    { name: ALG, iv, tagLength: TAG_LEN },
    key,
    cipher
  );
  return JSON.parse(new TextDecoder().decode(decrypted)) as Record<string, unknown>;
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes.buffer;
}

function bufferToBase64(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf));
}

function base64ToBuffer(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
