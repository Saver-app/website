import { Caveat, Dancing_Script, Figtree } from "next/font/google";
import { ColorScheme } from "./types/shared";

export const THEME: "system" | "light" | "dark" = "system";

export const SITE_URL = "https://saver-app.com";
export const APP_ID = "6766563672";
export const APP_STORE_URL = `https://apps.apple.com/app/id${APP_ID}`;
export const APP_STORE_DEEP_LINK =
  `itms-apps://itunes.apple.com/app/id${APP_ID}`;
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.saverapp.paket";
export const SAFARI_EXTENSION_APP_ID = "6771103161";
export const SAFARI_EXTENSION_APP_STORE_URL =
  `https://apps.apple.com/app/id${SAFARI_EXTENSION_APP_ID}`;
export const CHROME_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/niippnpocnnlkdlmibpongjakhidfjhb?utm_source=item-share-cb";
export const DISCORD_BOT_URL =
  "https://discord.com/oauth2/authorize?client_id=1416353094970642464";
export const WEB_APP_URL = "https://app.saver-app.com";
export const DISCORD_INVITE_URL = "https://discord.com/invite/f7BGpQFSeF";
export const REDDIT_URL = "https://www.reddit.com/r/SaverApp/";
export const PATREON_URL = "https://www.patreon.com/cw/saverapp";

/**
 * The one typeface of the site, loaded as a variable font so body copy, UI
 * and headlines all draw from the same family. Exposed as `--font-sans-family`
 * and consumed through the `--font-body`, `--font-display` and `--font-heavy`
 * tokens in `global.css`.
 */
export const BODY_FONT = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-family",
});

/**
 * Custom fonts for 'whimsical' and 'cursive' font styles.
 * Default system font is used for all other font styles.
 * See https://nextjs.org/docs/app/getting-started/fonts#google-fonts
 */
export const WHIMSICAL_FONT = Caveat({ subsets: ["latin"] });
export const CURSIVE_FONT = Dancing_Script({ subsets: ["latin"] });

export const MATERIAL_SYMBOLS = [
  "send",
  "ios_share",
  "group",
  "bookmark_add",
  "check_circle",
  "check",
  "list",
  "repeat",
  "cloud_off",
  "workspaces",
  "star",
  "mail",
  "open_in_new",
  "open_in_full",
  "play_arrow",
  "pause",
  "lock",
  "target",
  "smartphone",
  "tablet_mac",
  "language",
  "extension",
  "smart_toy",
  "favorite",
  "menu",
  "close",
] as const;

/*
  Neutral greys with the Saver yellow from the wordmark as the single accent
  hue. The yellow is too light to be text or an icon on white, so it only ever
  sits on a dark surface or works as a fill behind dark text.
*/
export const COLORS: ColorScheme = {
  LIGHT: {
    "text-primary": "#111113",
    "text-secondary": "rgba(17, 17, 19, 0.62)",
    "fill-0": "#FFFFFF",
    "fill-1": "#FFFFFF",
    "fill-2": "#F5F5F6",
    "fill-3": "#E8E8EA",
    "accent-brand": "#111113",
    "accent-gold": "#F6C80A",
    "accent-orange": "#C2410C",
    "accent-green": "#15803D",
    "accent-red": "#DC2626",
    "accent-blue": "#0E91CE",
    "accent-indigo": "#4338CA",
    "accent-mint": "#0F766E",
    "accent-purple": "#7E22CE",
    "accent-pink": "#DB2777",
  },
  DARK: {
    "text-primary": "#F7F7F8",
    "text-secondary": "rgba(247, 247, 248, 0.60)",
    "fill-0": "#19191B",
    "fill-1": "#0B0B0C",
    "fill-2": "#131314",
    "fill-3": "#2A2A2D",
    "accent-brand": "#F7F7F8",
    "accent-gold": "#F6C80A",
    "accent-orange": "#FB923C",
    "accent-green": "#4ADE80",
    "accent-red": "#F87171",
    "accent-blue": "#5BC8F3",
    "accent-indigo": "#818CF8",
    "accent-mint": "#5EEAD4",
    "accent-purple": "#C084FC",
    "accent-pink": "#F472B6",
  },
} as const;

export const MAX_RELEASE_NOTES_PER_PAGE = 5;

export const IS_WAITLIST_ENABLED = false;
