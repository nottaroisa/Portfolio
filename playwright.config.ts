import { defineConfig, devices } from "@playwright/test";

// Tests de aceptación en un navegador real. Sin BASE_URL se arranca la web en
// local con `next dev`; con BASE_URL se prueban contra esa dirección, por
// ejemplo la web publicada.
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "e2e",
  use: { ...devices["Desktop Chrome"], baseURL },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: "npm run dev", url: baseURL, reuseExistingServer: true, timeout: 120_000 },
});
