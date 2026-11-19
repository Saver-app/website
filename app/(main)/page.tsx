import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import { ConfettiHero } from "@/components/confetti_hero/confetti_hero";
import { DeviceScreenshot } from "@/components/device_screenshot/device_screenshot";
import { Icon } from "@/components/icon/icon";
import { JsonLd } from "@/components/json_ld/json_ld";
import { PlatformActionButton } from "@/components/platform_action_button/platform_action_button";
import { Section } from "@/components/section/section";
import {
  DISCORD_BOT_URL,
  DISCORD_INVITE_URL,
  MATERIAL_SYMBOLS,
  PATREON_URL,
  REDDIT_URL,
  WEB_APP_URL,
} from "@/constants";
import { HOME_STRUCTURED_DATA } from "@/lib/structured_data";
import styles from "./page.module.css";

import DiscordLogo from "@/public/app_view/discord_logo.svg";

/*
  Frames in /public/assets/framed: each screenshot already drawn into its
  bezel, at a few widths. They are generated from the files of the same name in
  /public/assets. A build refreshes them when a screenshot changes; while
  developing, run `npm run generate-device-frames` after replacing one.
*/
const SCREENSHOTS = {
  tasks: "saver_tasks",
  shareSheet: "saver_share_sheet",
  shareExtension: "saver_share_extension",
  spaces: "saver_spaces",
  habits: "saver_habits",
} as const;

/*
  How wide each phone is drawn, so the browser can pick the smallest frame that
  is still sharp. The breakpoints are the ones the phone slots use in
  page.module.css and confetti_hero.module.css.
*/
const PHONE_SIZES = {
  hero: "(min-width: 1000px) 260px, (min-width: 821px) 225px, 150px",
  spaceSwitcher: "(min-width: 900px) 240px, (min-width: 768px) 248px, 168px",
  spaceContents: "(min-width: 900px) 218px, (min-width: 768px) 226px, 152px",
  capture: "(min-width: 900px) 210px, (min-width: 768px) 188px, 142px",
} as const;

/*
  The other half of the promise. Each route is somewhere you already are when
  you find the thing, so the copy names the moment rather than the product.
  Icons are the same bare glyphs the platform list below uses, so the two
  sections read as one family.
*/
/* A Material symbol name, or a brand mark where the service has its own. */
type SectionIcon =
  | (typeof MATERIAL_SYMBOLS)[number]
  | React.FC<React.SVGProps<SVGSVGElement>>;

function SectionIcon({ icon, size }: { icon: SectionIcon; size: number }) {
  if (typeof icon === "string") {
    return <Icon name={icon} size={size} />;
  }

  const Logo = icon;

  return <Logo width={size} height={size} />;
}

interface CaptureRoute {
  icon: SectionIcon;
  title: string;
  description?: string;
}

/* The two routes almost everyone arrives through, and the pair the phones show. */
const captureRoutes: readonly CaptureRoute[] = [
  {
    icon: "ios_share",
    title: "Share sheet",
    description: "Send links, text, and notes from any app on your phone.",
  },
  {
    icon: "extension",
    title: "Safari & Chrome",
    description: "Save the page you’re viewing without leaving it.",
  },
] as const;

/*
  Real routes, but niche ones, and neither is in the screenshots. Norma demotes
  its Siri/Action Button/Widget entry points the same way rather than giving
  them a row each.
*/
const secondaryCaptureRoutes: readonly CaptureRoute[] = [
  {
    icon: DiscordLogo,
    title: "Discord",
  },
  {
    icon: "tablet_mac",
    title: "reMarkable",
  },
] as const;

interface Platform {
  /*
    One mark per platform. A second generic symbol beside it only works when
    both are real platform logos, which is what Grammarly's clusters are.
  */
  icon: SectionIcon;
  title: string;
  description: string;
  href: string;
}

const platforms: readonly Platform[] = [
  {
    icon: "smartphone",
    title: "iPhone & Android",
    description:
      "Start without an account and keep as much as you like on your phone.",
    href: "/download#mobile",
  },
  {
    icon: "language",
    title: "Web app",
    description: "Open your synced spaces from any browser.",
    href: WEB_APP_URL,
  },
  {
    icon: "extension",
    title: "Safari & Chrome",
    description: "Adds Saver to the browser you already use.",
    href: "/download#extensions",
  },
  {
    /*
      A generic symbol rather than Discord's mark: the tile tints its glyph
      yellow, and their logo is only to be shown in their own colours.
    */
    icon: "smart_toy",
    title: "Discord bot",
    description: "Runs in your server, for you and anyone you share a space with.",
    href: DISCORD_BOT_URL,
  },
  {
    icon: "tablet_mac",
    title: "reMarkable",
    description:
      "Pair the tablet with your synced tasks and send reminders to your phone.",
    href: "https://docs.saver-app.com/remarkable",
  },
] as const;

interface CommunityLink {
  title: string;
  description: string;
  href: string;
}

/* Same three places the footer lists, surfaced where people will see them. */
const communityLinks: readonly CommunityLink[] = [
  {
    title: "Join us on Discord",
    description:
      "Get help, ask questions, and meet other people who use Saver.",
    href: DISCORD_INVITE_URL,
  },
  {
    title: "r/SaverApp on Reddit",
    description:
      "Share how you use Saver, post ideas, and follow what’s coming next.",
    href: REDDIT_URL,
  },
  {
    title: "Support on Patreon",
    description: "Back the project and help decide what gets built next.",
    href: PATREON_URL,
  },
] as const;

interface Plan {
  name: string;
  description: string;
  price: string;
  priceSuffix?: string;
  billing: string;
  yearlySaving?: string;
  featureIntro?: string;
  features: readonly string[];
  action: string;
  href: string;
  featured?: boolean;
}

const plans: readonly Plan[] = [
  {
    name: "Free",
    description: "Free sync plus unlimited offline use.",
    price: "€0",
    billing: "No subscription required",
    features: [
      "2 synced spaces",
      "75 synced tasks and 25 bookmarks",
      "3 active habits",
      "2 collaborators across all spaces",
      "Unlimited offline use on mobile",
      "No account needed for offline use",
    ],
    action: "Start Free",
    href: "/download",
  },
  {
    name: "Plus",
    description: "Personal sync across your devices.",
    price: "€3.99",
    priceSuffix: "/ month",
    billing: "or €39.99 billed yearly",
    yearlySaving: "Save 17%",
    featureIntro: "Everything in Free, plus more sync capacity:",
    features: [
      "6 synced spaces",
      "750 synced tasks and 300 bookmarks",
      "15 active habits",
      "5 collaborators across all spaces",
    ],
    action: "Start Plus",
    href: WEB_APP_URL,
    featured: true,
  },
  {
    name: "Pro",
    description: "Larger spaces and shared projects.",
    price: "€5.99",
    priceSuffix: "/ month",
    billing: "or €59.99 billed yearly",
    yearlySaving: "Save 17%",
    featureIntro: "Everything in Plus, plus more sync capacity:",
    features: [
      "20 synced spaces",
      "3,000 synced tasks and 1,500 bookmarks",
      "50 active habits",
      "10 collaborators across all spaces",
      "Custom Discord bot branding",
    ],
    action: "Start Pro",
    href: WEB_APP_URL,
  },
];

const spaceContents = [
  { icon: "check_circle", label: "Tasks" },
  { icon: "list", label: "Lists" },
  { icon: "bookmark_add", label: "Bookmarks" },
  { icon: "repeat", label: "Habits" },
] as const satisfies readonly {
  icon: (typeof MATERIAL_SYMBOLS)[number];
  label: string;
}[];

/*
  Every note carries an icon from the same set as the capture routes below, so
  the three rows keep one rhythm instead of starting rich and going flat.
*/
const spaceNotes = [
  {
    icon: "group",
    title: "Share with others",
    description:
      "Invite people into a space so everyone works from the same tasks, lists, bookmarks, and habits. Nothing to copy or keep in sync.",
  },
  {
    icon: "cloud_off",
    title: "Works offline, too",
    description:
      "Spaces work offline on your phone, with no account required. Sync when you want them on another device, or when you’re ready to share.",
  },
] as const satisfies readonly {
  icon: (typeof MATERIAL_SYMBOLS)[number];
  title: string;
  description: string;
}[];

export default function Page() {
  return (
    <>
      <JsonLd data={HOME_STRUCTURED_DATA} />

      <ConfettiHero
        title={
          /*
            Two sentences on one line reads as a run-on once the title wraps,
            so each is its own block and the breaks land on the full stop
            instead of orphaning "All" onto the line above.
          */
          <>
            <span className={styles.heroTitleSentence}>
              Bookmarks, tasks, and habits.
            </span>{" "}
            <span
              className={`${styles.heroTitleSentence} ${styles.heroTitleAccent}`}
            >
              All in one space.
            </span>
          </>
        }
        subtitle="Save from any app. Access it across your devices. Share spaces with others."
        action={
          <div className={styles.heroActionStack}>
            <div className={styles.heroActions}>
              <PlatformActionButton size="medium" />
              <span className={styles.desktopOnlyAction}>
                <DownloadActionButton
                  href={WEB_APP_URL}
                  label="Open web app"
                  size="medium"
                  showAppleLogo={false}
                  variant="secondary"
                />
              </span>
              <span className={styles.mobileOnlyAction}>
                <DownloadActionButton
                  href="#platforms"
                  label="See all Saver platforms"
                  size="medium"
                  showAppleLogo={false}
                  variant="secondary"
                  openInNewTab={false}
                />
              </span>
            </div>
            <p className={styles.heroNote}>
              Free offline. No account required.
            </p>
          </div>
        }
        media={
          <div className={styles.heroProductPreview}>
            <DeviceScreenshot
              name={SCREENSHOTS.tasks}
              alt="Saver showing organized lists and tasks"
              sizes={PHONE_SIZES.hero}
              priority
            />
          </div>
        }
      />

      <section className={styles.spaceStory} aria-labelledby="spaces-title">
        <header className={styles.spaceStoryHeader}>
          <h2 id="spaces-title">Keep the whole plan together.</h2>
          <p>
            A trip is more than a to-do list. Keep packing tasks, booking
            links, and the habits you’re building in one place. The same goes
            for a course or whatever comes next.
          </p>
          <a
            className={styles.spaceLink}
            href="https://docs.saver-app.com/features/spaces"
            target="_blank"
            rel="noreferrer"
          >
            What is a space? <span aria-hidden="true">→</span>
          </a>
        </header>

        <div className={styles.spaceGrid}>
          <div className={styles.spaceStoryMedia}>
            <div className={styles.spaceStoryPhones}>
              {/*
                The switcher alone only argues for the idea of spaces, and it
                sits over an empty list while it does. A populated space behind
                it shows what the note above actually promises lands in one.
              */}
              <div
                className={`${styles.spaceStoryPhone} ${styles.spaceStoryPhoneSpace}`}
              >
                <DeviceScreenshot
                  name={SCREENSHOTS.habits}
                  alt="A Saver space holding habits with their weekly streaks"
                  sizes={PHONE_SIZES.spaceContents}
                />
              </div>
              <div
                className={`${styles.spaceStoryPhone} ${styles.spaceStoryPhoneSwitcher}`}
              >
                <DeviceScreenshot
                  name={SCREENSHOTS.spaces}
                  alt="Saver showing Personal, Work, Travel Plans, and Home spaces"
                  sizes={PHONE_SIZES.spaceSwitcher}
                />
              </div>
            </div>
          </div>

          <div className={styles.spaceNotes}>
            <article className={`${styles.spaceNote} ${styles.spaceNoteLead}`}>
              <h3>
                <span className={styles.spaceNoteIcon} aria-hidden="true">
                  <Icon name="workspaces" size={20} />
                </span>
                One space for the whole thing
              </h3>
              <p>
                Create one for whatever you’re planning: a trip to Japan, a new
                semester, anything. Tasks, lists, bookmarks, and habits all stay
                together inside it.
              </p>

              <ul className={styles.spaceContents}>
                {spaceContents.map((item) => (
                  <li key={item.label}>
                    <Icon name={item.icon} size={17} />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>

            {spaceNotes.map((note) => (
              <article key={note.title} className={styles.spaceNote}>
                <h3>
                  <span className={styles.spaceNoteIcon} aria-hidden="true">
                    <Icon name={note.icon} size={20} />
                  </span>
                  {note.title}
                </h3>
                <p>{note.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Section paddingTop={110} navigationAnchor="capture">
        {/*
          The header sits inside the grid rather than above it, so the phone
          panel starts level with the heading instead of below the intro.
        */}
        <div className={styles.captureGrid}>
          <div className={styles.captureColumn}>
            <header
              className={`${styles.editorialHeader} ${styles.captureHeader}`}
            >
              <h2>Save it from wherever you find it.</h2>
              <p>
                Things worth saving rarely show up at the right moment. Send
                them straight to Saver instead of stopping to make a note.
              </p>
            </header>

            <dl className={styles.captureRoutes}>
              {captureRoutes.map((route) => (
                <div key={route.title} className={styles.captureRoute}>
                  <dt>
                    <span className={styles.captureRouteIcon} aria-hidden="true">
                      <SectionIcon icon={route.icon} size={20} />
                    </span>
                    {route.title}
                  </dt>
                  <dd>{route.description}</dd>
                </div>
              ))}
            </dl>

            <p className={styles.captureAlso}>
              <span className={styles.captureAlsoLabel}>You can also save from</span>
              {secondaryCaptureRoutes.map((route) => (
                <span key={route.title} className={styles.captureAlsoItem}>
                  <span className={styles.captureAlsoIcon} aria-hidden="true">
                    <SectionIcon icon={route.icon} size={16} />
                  </span>
                  <strong>{route.title}</strong>
                </span>
              ))}
            </p>

            <p className={styles.captureNote}>
              Everything you save becomes a task, a bookmark, or a habit in
              the space you choose, ready to manage from anywhere.
            </p>
          </div>

          <div className={styles.captureMedia}>
            <div className={styles.capturePhones}>
              <div
                className={`${styles.capturePhone} ${styles.capturePhoneShare}`}
              >
                <DeviceScreenshot
                  name={SCREENSHOTS.shareSheet}
                  alt="An iPhone share sheet offering Saver for a Hakone travel article"
                  sizes={PHONE_SIZES.capture}
                />
              </div>
              <div
                className={`${styles.capturePhone} ${styles.capturePhoneSave}`}
              >
                <DeviceScreenshot
                  name={SCREENSHOTS.shareExtension}
                  alt="Saver saving the Hakone article as a bookmark in the Japan Trip space"
                  sizes={PHONE_SIZES.capture}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section paddingTop={110} navigationAnchor="platforms">
        <header className={styles.editorialHeader}>
          <h2>Saver across your devices.</h2>
          <p>
            Start with the mobile app. Add the web app, the browser extensions,
            your reMarkable, or the Discord bot when you want them.
          </p>
        </header>
        <ol className={styles.platformList}>
          {platforms.map((platform) => (
            <li key={platform.title} className={styles.platformItem}>
              <a
                className={styles.platformLink}
                href={platform.href}
                target={platform.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  platform.href.startsWith("http") ? "noreferrer" : undefined
                }
              >
                <span className={styles.platformIcon} aria-hidden="true">
                  <SectionIcon icon={platform.icon} size={22} />
                </span>
                <div className={styles.platformCopy}>
                  <h3>{platform.title}</h3>
                  <p>{platform.description}</p>
                </div>
                {platform.title === "Web app" && (
                  <span className={styles.mobilePlatformNote}>
                    Best for reviewing larger spaces on a computer.
                  </span>
                )}
              </a>
            </li>
          ))}
        </ol>
      </Section>

      <Section paddingTop={110} navigationAnchor="pricing">
        <header className={styles.editorialHeader}>
          <h2>Sync for free. Upgrade for more space.</h2>
          <p>
            Every plan syncs across your devices. Plus and Pro raise the limits
            for synced spaces, items, habits, and collaborators.
          </p>
        </header>

        <div className={styles.pricing}>
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`${styles.plan} ${plan.featured ? styles.featuredPlan : ""}`}
            >
              <div className={styles.planName}>
                <h3>{plan.name}</h3>
                {plan.featured && <span>Popular</span>}
              </div>

              <p className={styles.planDescription}>{plan.description}</p>

              <div className={styles.planPrice}>
                <p>
                  <strong>{plan.price}</strong>
                  {plan.priceSuffix && <span>{plan.priceSuffix}</span>}
                </p>
                <small>
                  {plan.billing}
                  {plan.yearlySaving && (
                    <span className={styles.planSaving}>
                      {plan.yearlySaving}
                    </span>
                  )}
                </small>
              </div>

              <a
                className={styles.planAction}
                href={plan.href}
                target={plan.href.startsWith("http") ? "_blank" : undefined}
                rel={plan.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {plan.action}
              </a>

              <div className={styles.planDetails}>
                {plan.featureIntro && (
                  <p className={styles.planFeatureIntro}>{plan.featureIntro}</p>
                )}
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Icon name="check" size={17} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.billingNote}>
          Offline use is free and unlimited. Paid plans renew until cancelled;
          synced-data limits vary by plan. Taxes and the final price appear at
          checkout.{" "}
          <a href="/terms">See subscription terms.</a>
        </p>
      </Section>

      <div className={`${styles.band} ${styles.closingBand}`}>
        <div className={styles.closingPanel}>
          <h2>Start with the thing you keep forgetting.</h2>
          <p className={styles.closingBody}>
            A link for later. A task that keeps slipping. A habit you want to
            stick to. Put it in Saver.
          </p>
          {/*
            The same three destinations as the hero's buttons, each under its
            own words: a link checker counts a text used twice on a page as a
            duplicate, even when both links lead to the same place.
          */}
          <div className={styles.closingActions}>
            <PlatformActionButton size="medium" label="Start using Saver" />
            <span className={styles.desktopOnlyAction}>
              <DownloadActionButton
                href={WEB_APP_URL}
                label="Try the web app"
                size="medium"
                showAppleLogo={false}
                variant="secondary"
              />
            </span>
            <span className={styles.mobileOnlyAction}>
              <DownloadActionButton
                href="#platforms"
                label="Choose your platform"
                size="medium"
                showAppleLogo={false}
                variant="secondary"
                openInNewTab={false}
              />
            </span>
          </div>
        </div>
      </div>

      <ul className={`${styles.band} ${styles.communityCards}`} id="community">
        {communityLinks.map((link) => (
          <li key={link.title}>
            <a
              className={styles.communityCard}
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
