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

test.describe("en una tablet táctil", () => {
  test.use({ viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true });

  test("la portada invita a tocar, no a mover el ratón", async ({ page }) => {
    // Dada la portada en una tablet sin ratón,
    await page.goto("/");
    const portada = page.getByRole("region", { name: "Portada" });

    // entonces la pista habla de tocar y no de un ratón que no hay.
    await expect(portada.getByText(/Toca/)).toBeVisible();
    await expect(portada.getByText(/Mueve el ratón/)).toBeHidden();
  });
});
