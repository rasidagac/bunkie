"use server";

import type { Readable } from "node:stream";

import { put } from "@vercel/blob";

type PutBody =
  | ArrayBuffer
  | Blob
  | Buffer
  | File
  | Readable
  | ReadableStream
  | string;

export default async function uploadFile(file: PutBody, pathname: string) {
  return await put(pathname, file, {
    access: "public",
    allowOverwrite: true,
  });
}
