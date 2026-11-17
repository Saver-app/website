import { defineConfig, devices } from "@playwright/test";

/* Not 3000: the dev server may be running there while the tests are. */
const PORT = 4319;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "off",
  },
  projects: [
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 14"] } },
  ],
  /* The tests check the static export, so `npm run build` has to come first. */
  webServer: {
    command: `node ./scripts/serve_static_export.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
  },
});
