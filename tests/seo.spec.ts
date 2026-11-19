import { expect, test } from "@playwright/test";

const SITE_URL = "https://saver-app.com";

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

/* A search result cuts a description off at about this length. */
const MAX_DESCRIPTION_LENGTH = 160;

test("every page has its own title, a description, and a canonical URL", async ({
  page,
}) => {
  const titles = new Map<string, string>();

  for (const path of PAGES) {
    await page.goto(path);

    const title = await page.title();
    expect(title, `${path} title`).not.toBe("");
    expect(titles.get(title), `${path} shares its title`).toBeUndefined();
    titles.set(title, path);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description?.length ?? 0, `${path} description`).toBeGreaterThan(40);
    expect(description?.length ?? 0, `${path} description`).toBeLessThanOrEqual(
      MAX_DESCRIPTION_LENGTH,
    );

    await expect(
      page.locator('link[rel="canonical"]'),
      `${path} canonical`,
    ).toHaveAttribute("href", path === "/" ? SITE_URL : `${SITE_URL}${path}`);

    expect(await page.locator("h1").count(), `${path} h1`).toBeGreaterThan(0);
  }
});

test("icons add no words to the text of a page", async ({ page }) => {
  for (const path of ["/", "/download"]) {
    await page.goto(path);

    const icons = page.locator(".material-symbols-rounded");
    expect(await icons.count(), `${path} icons`).toBeGreaterThan(0);

    const texts = await icons.evaluateAll((elements) =>
      elements.map((element) => element.textContent ?? ""),
    );
    expect(texts.join(""), `${path} icon text`).toBe("");
  }
});

test("the home page describes the site, its publisher, and the app", async ({
  page,
}) => {
  await page.goto("/");

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(blocks).toHaveLength(1);

  const nodes: { "@type": string; name?: string; url?: string }[] =
    JSON.parse(blocks[0])["@graph"];
  expect(nodes.map((node) => node["@type"])).toEqual([
    "Organization",
    "WebSite",
    "SoftwareApplication",
  ]);

  for (const node of nodes) {
    expect(node.name).toBe("Saver");
    expect(node.url).toBe(`${SITE_URL}/`);
  }
});

test("page 1 of the release notes points to the release notes page", async ({
  page,
}) => {
  await page.goto("/release-notes/1");

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${SITE_URL}/release-notes`,
  );
});

test("the sitemap lists every page once", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);

  const urls = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => match[1],
  );

  expect(new Set(urls).size).toBe(urls.length);
  expect(urls).not.toContain(`${SITE_URL}/release-notes/1`);

  for (const path of PAGES) {
    expect(urls).toContain(path === "/" ? SITE_URL : `${SITE_URL}${path}`);
  }
});
