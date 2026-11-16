import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import styles from "./confetti_hero.module.css";

interface ConfettiHeroProps {
  title: ReactNode;
  subtitle: string;
  action?: ReactNode;
  media?: ReactNode;
}

/*
  The pieces are one composition around the phone, not a scatter across the
  panel. `dx`, `dy` and `size` are multiples of the phone's width, measured
  from its centre (the phone is 1 wide and 2 tall, so its edges sit at ±0.5 and
  ±1). The copy column carries none, which keeps the headline clear at every
  width without a second set of coordinates.

  `near` pieces are large and sit half behind the phone's edges, so they read
  as layers of one object. `far` pieces are small and float clear of it, which
  only works while the column beside the phone has room for them.
*/
interface Decoration {
  src: string;
  dx: number;
  dy: number;
  size: number;
  rotation: number;
  depth: "near" | "far";
}

const DECORATIONS: readonly Decoration[] = [
  {
    src: "/assets/confetti/yellow_bookmark.svg",
    dx: -0.58,
    dy: -0.66,
    size: 0.36,
    rotation: -14,
    depth: "near",
  },
  {
    src: "/assets/confetti/blue_plus.svg",
    dx: 0.58,
    dy: -0.3,
    size: 0.27,
    rotation: 14,
    depth: "near",
  },
  {
    src: "/assets/confetti/red_bookmark.svg",
    dx: -0.6,
    dy: 0.22,
    size: 0.24,
    rotation: 12,
    depth: "near",
  },
  {
    src: "/assets/confetti/green_star.svg",
    dx: 0.6,
    dy: 0.46,
    size: 0.26,
    rotation: -10,
    depth: "near",
  },
  {
    src: "/assets/confetti/orange_plus.svg",
    dx: -0.58,
    dy: 0.78,
    size: 0.19,
    rotation: -18,
    depth: "near",
  },
  {
    src: "/assets/confetti/green_bookmark.svg",
    dx: -0.76,
    dy: -0.93,
    size: 0.085,
    rotation: -20,
    depth: "far",
  },
  {
    src: "/assets/confetti/orange_bookmark.svg",
    dx: 0.78,
    dy: -0.74,
    size: 0.1,
    rotation: 18,
    depth: "far",
  },
  {
    src: "/assets/confetti/green_plus.svg",
    dx: -0.8,
    dy: -0.26,
    size: 0.11,
    rotation: 22,
    depth: "far",
  },
  {
    src: "/assets/confetti/yellow_star.svg",
    dx: 0.84,
    dy: 0.06,
    size: 0.12,
    rotation: -20,
    depth: "far",
  },
  {
    src: "/assets/confetti/blue_star.svg",
    dx: -0.78,
    dy: 0.56,
    size: 0.09,
    rotation: 15,
    depth: "far",
  },
  {
    src: "/assets/confetti/yellow_plus.svg",
    dx: 0.8,
    dy: 0.8,
    size: 0.085,
    rotation: -12,
    depth: "far",
  },
] as const;

export function ConfettiHero({
  title,
  subtitle,
  action,
  media,
}: ConfettiHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.panel}>
        <div
          className={`${styles.layout} ${media ? styles.layoutWithMedia : ""}`}
        >
          <div className={styles.content}>
            <h1 id="home-hero-title">{title}</h1>
            <p>{subtitle}</p>
            {action && <div className={styles.action}>{action}</div>}
          </div>

          {media && (
            <div className={styles.media}>
              <div className={styles.decorations} aria-hidden="true">
                {DECORATIONS.map((decoration) => {
                  const pieceStyle = {
                    "--piece-dx": decoration.dx,
                    "--piece-dy": decoration.dy,
                    "--piece-size": decoration.size,
                    "--piece-rotation": `${decoration.rotation}deg`,
                  } as CSSProperties;

                  return (
                    <span
                      className={styles.piece}
                      data-hero-decoration
                      data-depth={decoration.depth}
                      key={decoration.src}
                      style={pieceStyle}
                    >
                      <Image
                        src={decoration.src}
                        alt=""
                        width={110}
                        height={110}
                      />
                    </span>
                  );
                })}
              </div>

              {media}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
