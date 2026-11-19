/* eslint-disable @next/next/no-img-element */

import styles from "./device_screenshot.module.css";

/* Keep in step with OUTPUT_WIDTHS in scripts/generate_device_frames.mjs. */
const FRAME_WIDTHS = [360, 540, 810] as const;
const FRAME_DIRECTORY = "/assets/framed";

/* Intrinsic size of the bezel artwork every frame is cut from. */
const FRAME_WIDTH = 1350;
const FRAME_HEIGHT = 2760;

interface DeviceScreenshotProps {
  /** A frame written by `npm run generate-device-frames`, without width or extension. */
  name: string;
  alt: string;
  /** How wide the phone is drawn at each breakpoint, as for `<img sizes>`. */
  sizes: string;
  /** Set on the one phone that is on screen before any scrolling. */
  priority?: boolean;
}

/*
  A screenshot already drawn into its bezel, served as an ordinary image.

  `Hero.Image` composes the same picture in the browser on a canvas, so nothing
  shows until the scripts have run and three full-size files have loaded. This
  one is in the HTML, picks a file to match the screen, and the browser can
  fetch it before any script. It fills its parent the way `Hero.Image` does, so
  the two are interchangeable in a layout.
*/
export function DeviceScreenshot({
  name,
  alt,
  sizes,
  priority = false,
}: DeviceScreenshotProps) {
  const srcSet = FRAME_WIDTHS.map(
    (width) => `${FRAME_DIRECTORY}/${name}_${width}w.webp ${width}w`,
  ).join(", ");

  return (
    <div className={styles.deviceScreenshot}>
      <img
        className={styles.image}
        src={`${FRAME_DIRECTORY}/${name}_${FRAME_WIDTHS[1]}w.webp`}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? undefined : "async"}
        fetchPriority={priority ? "high" : undefined}
      />
    </div>
  );
}
