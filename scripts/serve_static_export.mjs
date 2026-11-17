#!/usr/bin/env node

/*
  Serves the static export in out/ the way the host does: /download answers
  with download.html. Used by the Playwright tests, so they run against the
  files that ship rather than the dev server.

  Usage: node scripts/serve_static_export.mjs [port]
*/

import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "out");
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4319);

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

if (!existsSync(ROOT)) {
  console.error("out/ does not exist. Run `npm run build` first.");
  process.exit(1);
}

function isFile(file) {
  return file.startsWith(ROOT) && existsSync(file) && statSync(file).isFile();
}

function resolveFile(urlPath) {
  const pathname = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    pathname === "/" ? "/index.html" : pathname,
    `${pathname.replace(/\/$/, "")}.html`,
    path.join(pathname, "index.html"),
  ];

  for (const candidate of candidates) {
    const file = path.join(ROOT, candidate);

    if (isFile(file)) {
      return file;
    }
  }

  return null;
}

const server = http.createServer(async (request, response) => {
  const file = resolveFile(request.url ?? "/");
  const target = file ?? path.join(ROOT, "404.html");

  if (!isFile(target)) {
    response.writeHead(404).end("Not found");
    return;
  }

  response.writeHead(file ? 200 : 404, {
    "content-type":
      CONTENT_TYPES[path.extname(target).toLowerCase()] ??
      "application/octet-stream",
  });
  response.end(await readFile(target));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Serving out/ on http://127.0.0.1:${PORT}`);
});
