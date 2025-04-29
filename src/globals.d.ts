// src/globals.d.ts
export {};

declare global {
  interface Window {
    Buffer: typeof import("buffer").Buffer;
  }
}
