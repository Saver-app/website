import fs from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const APP_ICON_PATH =
  process.env.APP_ICON_PATH ||
  path.resolve(process.cwd(), "public", "app_icon.png");
const PUBLIC_DIRECTORY = path.resolve(process.cwd(), "public");

/*
  One icon is not enough for everything that asks for one. Google recommends a
  favicon larger than 48px for its results, iOS takes a 180px icon for the home
  screen, and whatever does not read the page's <link> tags asks for
  /favicon.ico. The file names stay the same from run to run, because a search
  engine keeps the icon it found at a URL.
*/
const FAVICON_SIZE = 96;
const APPLE_TOUCH_ICON_SIZE = 180;
const ICO_SIZES = [16, 32, 48];

if (!fs.existsSync(APP_ICON_PATH)) {
  console.error(
    `${APP_ICON_PATH} does not exist. Provide a valid app icon path with APP_ICON_PATH environment variable.`
  );
  process.exit(1);
}

function renderPng(size) {
  return sharp(APP_ICON_PATH).resize(size, size).png().toBuffer();
}

/*
  An .ico file is a small directory followed by the images it lists. Each image
  can be an ordinary PNG, which every current browser and crawler reads.
*/
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + images.length * 16;

  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;

    return entry;
  });

  return Buffer.concat([
    header,
    ...entries,
    ...images.map((image) => image.data),
  ]);
}

try {
  const icoImages = await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, data: await renderPng(size) }))
  );

  const outputs = [
    ["favicon.png", await renderPng(FAVICON_SIZE)],
    ["favicon.ico", buildIco(icoImages)],
    [
      "apple-touch-icon.png",
      /* iOS paints transparent corners black anyway, so do it here on purpose. */
      await sharp(APP_ICON_PATH)
        .resize(APPLE_TOUCH_ICON_SIZE, APPLE_TOUCH_ICON_SIZE)
        .flatten({ background: "#000000" })
        .png()
        .toBuffer(),
    ],
  ];

  for (const [fileName, data] of outputs) {
    const outputPath = path.join(PUBLIC_DIRECTORY, fileName);

    await writeFile(outputPath, data);
    console.log(`Saved ${outputPath}.`);
  }
} catch (err) {
  console.error("Error generating favicon:", err);
  process.exit(1);
}
