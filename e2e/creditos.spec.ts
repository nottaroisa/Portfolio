import { expect, test } from "@playwright/test";

// Una página que dice de dónde sale cada cosa de la web que no es mía y con qué
// licencia se usa, con el crédito que pide cada una.
test("desde el pie se llega a la página de créditos y licencias", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer").getByRole("link", { name: "Créditos y licencias" }).click();
  await expect(page).toHaveURL(/\/creditos\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Créditos y licencias");
});

test("el birrete lleva el crédito que pide su licencia CC BY", async ({ page }) => {
  await page.goto("/creditos");
  const birrete = page.getByRole("listitem").filter({ hasText: "Graduation Hat" });
  await expect(birrete).toContainText("DevFaisal");
  await expect(birrete).toContainText("CC BY 4.0");
  await expect(birrete.getByRole("link", { name: /Graduation Hat/ })).toHaveAttribute("href", "https://sketchfab.com/3d-models/graduation-hat-b0a7e821403b4c8cb8e1d32ea4075eac");
  await expect(birrete.getByRole("link", { name: "DevFaisal" })).toHaveAttribute("href", "https://sketchfab.com/DevFaisal");
  await expect(birrete.getByRole("link", { name: "CC BY 4.0" })).toHaveAttribute("href", "https://creativecommons.org/licenses/by/4.0/");
  await expect(birrete).toContainText(/simplificad|reducid/i);
});

test("cada cosa de fuera dice de dónde sale y con qué licencia", async ({ page }) => {
  await page.goto("/creditos");
  const esperado: [string, RegExp][] = [
    ["threejsassets", /threejsassets\.com/],
    ["animateicons", /github\.com\/Avijit07x\/animateicons/],
    ["Lucide", /lucide\.dev/],
    ["three.js", /threejs\.org/],
    ["Draco", /github\.com\/google\/draco/],
    ["Instrument Serif", /fonts\.google\.com/],
    ["Space Mono", /fonts\.google\.com/],
    ["ui-layouts", /github\.com\/ui-layouts/],
    ["Next.js", /nextjs\.org/],
    ["framer-motion", /motion\.dev/],
  ];
  for (const [nombre, url] of esperado) {
    const enlace = page.getByRole("link", { name: nombre, exact: true }).first();
    const fila = page.getByRole("listitem").filter({ has: enlace });
    await expect(fila, nombre).toBeVisible();
    await expect(enlace, nombre).toHaveAttribute("href", url);
    await expect(fila, nombre).toContainText(/MIT|ISC|Apache|OFL|licencia propia|CC/);
  }
});

test("los créditos cuentan qué es mío y qué es de terceros: vídeos, marcas y certificados", async ({ page }) => {
  await page.goto("/creditos");
  const main = page.getByRole("main");
  await expect(main).toContainText(/vídeos[\s\S]*@srtajeans/i);
  await expect(main).toContainText(/marcas[\s\S]*sus propietarios/i);
  await expect(main).toContainText(/certificados[\s\S]*emitidos por/i);
});
