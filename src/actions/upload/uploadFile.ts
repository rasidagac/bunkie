"use server";

import type { Readable } from "node:stream";

import { put } from "@vercel/blob";

type PutBody =
  | string
  | Readable
  | Buffer
  | Blob
  | ArrayBuffer
  | ReadableStream
  | File;

export default async function uploadFile(file: PutBody, pathname: string) {
  return await put(pathname, file, {
    access: "public",
    allowOverwrite: true,
  });
}
