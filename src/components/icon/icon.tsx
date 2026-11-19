import type { MATERIAL_SYMBOLS } from "@/constants";
import styles from "./icon.module.css";

interface IconProps {
  name: (typeof MATERIAL_SYMBOLS)[number];
  filled?: boolean;
  size?: "small" | "medium" | "large" | number;
}

export function Icon({ name, filled = true, size = "medium" }: IconProps) {
  const isCustomSize = typeof size === "number";

  /*
    The font draws a glyph wherever it finds the glyph's name. Written into the
    element, that name is also part of the page's text, and a search engine
    reads a heading as "cloud_offWorks offline, too". The name is passed as an
    attribute instead and drawn by the stylesheet, which looks the same and
    leaves the text as it is written.
  */
  return (
    <span
      className={`material-symbols-rounded ${styles.icon} ${
        filled ? styles.iconFilled : styles.iconOutlined
      } ${isCustomSize ? "" : styles[size]}`}
      style={isCustomSize ? { fontSize: size } : undefined}
      data-icon={name}
    />
  );
}
