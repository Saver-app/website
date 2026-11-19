import {
  APP_STORE_URL,
  GITHUB_URL,
  INSTAGRAM_URL,
  PATREON_URL,
  PLAY_STORE_URL,
  REDDIT_URL,
  SITE_NAME,
  SITE_URL,
  X_URL,
  YOUTUBE_URL,
} from "@/constants";

const HOME_URL = `${SITE_URL}/`;
const ORGANIZATION_ID = `${HOME_URL}#organization`;
const APP_ICON_URL = `${SITE_URL}/app_icon.png`;

/*
  Tells search engines what the home page is about in terms they do not have to
  guess: who publishes the site, what the site is called, and that Saver is an
  app, where to get it, and that it is free. "Saver" is a common word and the
  name of several unrelated apps, so the alternate names and the profile links
  are what tie this site to this one.

  There is no rating here on purpose. Google only accepts one that is shown on
  the page and comes from real reviews.
*/
export const HOME_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: "Saver App",
      url: HOME_URL,
      logo: APP_ICON_URL,
      sameAs: [
        GITHUB_URL,
        YOUTUBE_URL,
        INSTAGRAM_URL,
        X_URL,
        REDDIT_URL,
        PATREON_URL,
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${SITE_URL}/support`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${HOME_URL}#website`,
      name: SITE_NAME,
      alternateName: ["Saver App", "saver-app.com"],
      url: HOME_URL,
      inLanguage: "en",
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${HOME_URL}#app`,
      name: SITE_NAME,
      alternateName: "Saver App",
      description:
        "Saver keeps tasks, bookmarks, and habits together in shared spaces. Save from the share sheet, a browser extension, Discord, or a reMarkable tablet, use it offline without an account, and sync across iPhone, Android, and the web.",
      url: HOME_URL,
      image: APP_ICON_URL,
      screenshot: `${SITE_URL}/assets/framed/saver_tasks_810w.webp`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "iOS, Android, Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
      featureList: [
        "Tasks and lists",
        "Bookmarks in folders",
        "Habits with streaks",
        "Spaces shared with other people",
        "Offline use without an account",
        "Sync across iPhone, Android, and the web",
        "Saving from the share sheet, Safari, Chrome, Discord, and reMarkable",
      ],
      publisher: { "@id": ORGANIZATION_ID },
      sameAs: [APP_STORE_URL, PLAY_STORE_URL],
    },
  ],
} as const;
