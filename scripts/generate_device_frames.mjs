#!/usr/bin/env node

/*
  Draws each landing-page screenshot into its iPhone bezel ahead of time and
  writes the result at a few widths, so the page can show a plain <img> with a
  srcset (see src/components/device_screenshot).

  The same picture used to be composed in the browser on a 1350 x 2760 canvas,
  which meant the phones only appeared after the scripts had loaded and run,
  however small they were shown. The steps below mirror that canvas pipeline
  (src/hooks/useBezelImageRenderer.ts) one for one.

  Usage:
    node scripts/generate_device_frames.mjs             write every frame
    node scripts/generate_device_frames.mjs --if-stale  only when an input changed
*/

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIRECTORY = path.join(ROOT, "public");
const OUTPUT_DIRECTORY = path.join(PUBLIC_DIRECTORY, "assets", "framed");
const LOCK_PATH = path.join(ROOT, "scripts", "device_frames.lock.json");

/* Keep in step with FRAME_WIDTHS in device_screenshot.tsx. */
const OUTPUT_WIDTHS = [360, 540, 810];
const WEBP_OPTIONS = { quality: 82, alphaQuality: 100, effort: 6 };

/* Same values as "iPhone 17 Pro Silver" in device_bezel_configuration_map.ts. */
const IPHONE_17_PRO_SILVER = {
  src: "app_view/bezels/iphone_17_pro/silver_portrait.webp",
  maskSrc: "app_view/bezels/iphone_17_pro/mask.png",
  horizontalOffset: 72,
  verticalOffset: 69,
};

const FRAMES = [
  { name: "saver_tasks", screenshot: "assets/saver_tasks.webp" },
  { name: "saver_habits", screenshot: "assets/saver_habits.webp" },
  { name: "saver_spaces", screenshot: "assets/saver_spaces.webp" },
  { name: "saver_share_sheet", screenshot: "assets/saver_share_sheet.webp" },
  {
    name: "saver_share_extension",
    screenshot: "assets/saver_share_extension.webp",
  },
].map((frame) => ({ ...frame, bezel: IPHONE_17_PRO_SILVER }));

const onlyIfStale = process.argv.includes("--if-stale");

function outputPath(name, width) {
  return path.join(OUTPUT_DIRECTORY, `${name}_${width}w.webp`);
}

function allOutputsExist() {
  return FRAMES.every((frame) =>
    OUTPUT_WIDTHS.every((width) => existsSync(outputPath(frame.name, width))),
  );
}

/* One digest over every input file and every setting that shapes the output. */
async function readInputDigest() {
  const hash = createHash("sha256");

  hash.update(JSON.stringify({ OUTPUT_WIDTHS, WEBP_OPTIONS, FRAMES }));

  const inputFiles = new Set();
  for (const frame of FRAMES) {
    inputFiles.add(frame.screenshot);
    inputFiles.add(frame.bezel.src);
    inputFiles.add(frame.bezel.maskSrc);
  }

  for (const file of [...inputFiles].sort()) {
    hash.update(file);
    hash.update(await readFile(path.join(PUBLIC_DIRECTORY, file)));
  }

  return hash.digest("hex");
}

async function readLockedDigest() {
  try {
    return JSON.parse(await readFile(LOCK_PATH, "utf8")).inputDigest;
  } catch {
    return null;
  }
}

async function composeFrame(sharp, frame) {
  const bezelPath = path.join(PUBLIC_DIRECTORY, frame.bezel.src);
  const { width, height } = await sharp(bezelPath).metadata();
  const { horizontalOffset, verticalOffset } = frame.bezel;

  const screenshot = await sharp(path.join(PUBLIC_DIRECTORY, frame.screenshot))
    .resize(width - horizontalOffset * 2, height - verticalOffset * 2, {
      fit: "fill",
    })
    .ensureAlpha()
    .png()
    .toBuffer();

  const mask = await sharp(path.join(PUBLIC_DIRECTORY, frame.bezel.maskSrc))
    .resize(width, height, { fit: "fill" })
    .ensureAlpha()
    .png()
    .toBuffer();

  const bezel = await sharp(bezelPath).ensureAlpha().png().toBuffer();

  /*
    Screenshot inside the bezel's offsets, cut to the screen shape by the mask,
    then the bezel on top: the order the canvas used.
  */
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: screenshot, left: horizontalOffset, top: verticalOffset },
      { input: mask, blend: "dest-in" },
      { input: bezel, blend: "over" },
    ])
    .png()
    .toBuffer();
}

async function generate() {
  const { default: sharp } = await import("sharp");

  await mkdir(OUTPUT_DIRECTORY, { recursive: true });

  for (const frame of FRAMES) {
    const composed = await composeFrame(sharp, frame);

    for (const width of OUTPUT_WIDTHS) {
      const target = outputPath(frame.name, width);
      const { size } = await sharp(composed)
        .resize({ width })
        .webp(WEBP_OPTIONS)
        .toFile(target);

      console.log(
        `${path.relative(ROOT, target)}  ${(size / 1024).toFixed(1)} kB`,
      );
    }
  }
}

async function main() {
  for (const frame of FRAMES) {
    for (const file of [
      frame.screenshot,
      frame.bezel.src,
      frame.bezel.maskSrc,
    ]) {
      if (!existsSync(path.join(PUBLIC_DIRECTORY, file))) {
        console.error(
          `public/${file} does not exist. Update FRAMES in scripts/generate_device_frames.mjs.`,
        );
        process.exit(1);
      }
    }
  }

  const inputDigest = await readInputDigest();

  if (
    onlyIfStale &&
    allOutputsExist() &&
    (await readLockedDigest()) === inputDigest
  ) {
    console.log("Device frames are up to date.");
    return;
  }

  try {
    await generate();
  } catch (error) {
    /*
      As a build step this must not take a deploy down with it: the frames are
      committed, so the last good set is still there to ship.
    */
    if (onlyIfStale && allOutputsExist()) {
      console.warn(
        "Could not regenerate the device frames; keeping the committed ones. Run `npm run generate-device-frames` locally.",
        error,
      );
      return;
    }

    throw error;
  }

  await writeFile(LOCK_PATH, `${JSON.stringify({ inputDigest }, null, 2)}\n`);
  console.log("Device frames written to public/assets/framed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
