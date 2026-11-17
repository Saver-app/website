import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const PAGES = [
  "/",
  "/download",
  "/support",
  "/privacy",
  "/terms",
  "/return-policy",
  "/data-request",
  "/impressum",
  "/credits",
  "/release-notes",
] as const;

const PHONE_WIDTHS = [320, 375, 430] as const;
const MIN_TARGET = 44;

async function openMenu(page: Page) {
  const button = page.getByRole("button", { name: "Menu" });

  /* The button only works once the page has hydrated, so retry the tap. */
  await expect(async () => {
    if ((await button.getAttribute("aria-expanded")) !== "true") {
      await button.tap();
    }
    await expect(button).toHaveAttribute("aria-expanded", "true", {
      timeout: 500,
    });
  }).toPass();

  return button;
}

for (const width of PHONE_WIDTHS) {
  test(`pages do not scroll sideways at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });

    for (const path of PAGES) {
      await page.goto(path);

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );

      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test("the menu opens, lists every link, and closes again", async ({ page }) => {
  await page.goto("/");

  const button = await openMenu(page);
  const menu = page.locator("#navbar-mobile-menu");

  await expect(menu).toBeVisible();
  for (const label of ["Download", "Capture", "Pricing", "Docs"]) {
    await expect(
      menu.getByRole("link", { name: label, exact: true }),
    ).toBeVisible();
  }

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(button).toHaveAttribute("aria-expanded", "false");

  await openMenu(page);
  const box = await menu.boundingBox();
  await page.touchscreen.tap(100, (box?.y ?? 0) + (box?.height ?? 0) + 80);
  await expect(menu).toBeHidden();
});

test("a menu link scrolls to its section and clears the navbar", async ({
  page,
}) => {
  await page.goto("/");
  await openMenu(page);

  await page
    .locator("#navbar-mobile-menu")
    .getByRole("link", { name: "Pricing", exact: true })
    .tap();

  await expect(page.locator("#navbar-mobile-menu")).toBeHidden();
  await expect(page).toHaveURL(/#pricing$/);

  const heading = page.locator("#pricing h2");
  await expect(heading).toBeInViewport();

  const headingTop = (await heading.boundingBox())?.y ?? 0;
  expect(headingTop).toBeGreaterThan(64);
});

for (const [width, height] of [
  [568, 320],
  [740, 360],
] as const) {
  test(`the whole menu is reachable sideways at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await openMenu(page);

    const menu = page.locator("#navbar-mobile-menu");
    const box = await menu.boundingBox();
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(height);

    const lastAction = menu.getByRole("link", { name: "Open web app" });
    await lastAction.scrollIntoViewIfNeeded();
    await expect(lastAction).toBeInViewport();
  });
}

test("touch targets are at least 44px tall", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/");

  const heights = await page.evaluate(() => {
    const measure = (selector: string) =>
      [...document.querySelectorAll(selector)].map((element) => ({
        label: (element.textContent ?? "").trim().slice(0, 40),
        height: Math.round(element.getBoundingClientRect().height),
      }));

    return [
      ...measure("nav button"),
      ...measure("footer a"),
      ...measure('a[href*="features/spaces"]'),
      ...measure('a[href="#platforms"]'),
    ];
  });

  expect(heights.length).toBeGreaterThan(20);
  for (const target of heights) {
    expect(target.height, target.label).toBeGreaterThanOrEqual(MIN_TARGET - 1);
  }
});

test("the hero phone is a real image that loads without scripts", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");

  const phone = page.getByAltText("Saver showing organized lists and tasks");
  await expect(phone).toBeVisible();
  await expect
    .poll(() => phone.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);

  await expect(page.getByAltText("App Icon").first()).toBeVisible();
  await context.close();
});

test("the support form fits a small phone and keeps 16px inputs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/support");

  for (const label of ["Name", "Email", "Message"]) {
    const field = page.getByLabel(label);
    await expect(field).toBeVisible();

    /* Below 16px, iOS Safari zooms the page when the field is focused. */
    const fontSize = await field.evaluate((element) =>
      parseFloat(getComputedStyle(element).fontSize),
    );
    expect(fontSize, label).toBeGreaterThanOrEqual(16);
  }

  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeVisible();
});
