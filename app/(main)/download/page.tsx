import type { Metadata } from "next";

import { Icon } from "@/components/icon/icon";
import { Section } from "@/components/section/section";
import {
  APP_STORE_URL,
  CHROME_EXTENSION_URL,
  DISCORD_BOT_URL,
  PLAY_STORE_URL,
  SAFARI_EXTENSION_APP_STORE_URL,
  WEB_APP_URL,
} from "@/constants";
import type { MATERIAL_SYMBOLS } from "@/constants";
import { createPageMetadata } from "@/lib/site_metadata";
import styles from "./page.module.css";

interface DownloadOption {
  name: string;
  description: string;
  destination: string;
  icon: (typeof MATERIAL_SYMBOLS)[number];
  href?: string;
}

const mobileApps: readonly DownloadOption[] = [
  {
    name: "iPhone & iPad",
    description: "Use Saver offline on your Apple devices.",
    destination: "Open App Store",
    icon: "smartphone",
    href: APP_STORE_URL,
  },
  {
    name: "Android",
    description: "Use Saver offline on your Android phone or tablet.",
    destination: "Open Google Play",
    icon: "smartphone",
    href: PLAY_STORE_URL,
  },
];

const browserExtensions: readonly DownloadOption[] = [
  {
    name: "Safari extension",
    description: "Save bookmarks from Safari as you browse.",
    destination: "Open App Store",
    icon: "extension",
    href: SAFARI_EXTENSION_APP_STORE_URL,
  },
  {
    name: "Chrome extension",
    description: "Save bookmarks without leaving Chrome.",
    destination: "Open Chrome Web Store",
    icon: "extension",
    href: CHROME_EXTENSION_URL,
  },
];

const otherWaysToUseSaver: readonly DownloadOption[] = [
  {
    name: "Web app",
    description: "Use Saver in your browser without installing anything.",
    destination: "Open Web App",
    icon: "language",
    href: WEB_APP_URL,
  },
  {
    name: "Discord bot",
    description: "Create, find, and share Saver items from Discord.",
    destination: "Add to Discord",
    icon: "smart_toy",
    href: DISCORD_BOT_URL,
  },
  {
    name: "reMarkable",
    description:
      "Sync tasks and turn selected handwriting into a new task.",
    destination: "Open setup guide",
    icon: "tablet_mac",
    href: "https://docs.saver-app.com/remarkable",
  },
];

export const metadata = createPageMetadata({
  title: "Download Saver for iPhone, Android, and the Web",
  description:
    "Download Saver free for iPhone, iPad, and Android. Add the Safari or Chrome extension, open the web app, or connect the Discord bot and your reMarkable.",
  path: "/download",
}) satisfies Metadata;

function DownloadGrid({ options }: { options: readonly DownloadOption[] }) {
  return (
    <div className={styles.downloadGrid}>
      {options.map((option) => (
        <article className={styles.downloadCard} key={option.name}>
          <div className={styles.cardIcon} aria-hidden="true">
            <Icon name={option.icon} size="large" />
          </div>

          <div className={styles.cardCopy}>
            <h3>{option.name}</h3>
            <p>{option.description}</p>
          </div>

          {option.href ? (
            <a
              className={styles.downloadLink}
              href={option.href}
              target="_blank"
              rel="noreferrer"
            >
              {option.destination}
            </a>
          ) : (
            <span className={styles.storeLabel}>{option.destination}</span>
          )}
        </article>
      ))}
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Section
      title="Download Saver for your devices"
      subtitle="Download Saver on your phone or tablet to use it offline. Sign in on your other devices to open your synced spaces. You can also save links directly from your browser or Discord."
      headingLevel={1}
      headerLayout="editorial"
      paddingTop={70}
      paddingBottom={120}
    >
      <div className={styles.downloadPage}>
        <div className={styles.downloadGroup} id="mobile">
          <h2>Mobile apps</h2>
          <DownloadGrid options={mobileApps} />
        </div>

        <div className={styles.downloadGroup} id="extensions">
          <h2>Browser extensions</h2>
          <DownloadGrid options={browserExtensions} />
        </div>

        <div className={styles.downloadGroup}>
          <h2>More ways to use Saver</h2>
          <DownloadGrid options={otherWaysToUseSaver} />
        </div>
      </div>
    </Section>
  );
}
