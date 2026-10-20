import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("en el móvil la portada no se desborda a lo ancho", async ({ page }) => {
  // Dada la portada en un móvil,
  await page.goto("/");

  // cuando se mide el ancho de la página,
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  // entonces cabe en la pantalla, sin scroll horizontal.
  expect(desborde).toBe(0);
});
