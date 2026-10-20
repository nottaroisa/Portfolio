import { expect, test } from "@playwright/test";

const CORREO = "isabellanottaro@gmail.com";

test("todos los enlaces de correo llevan al correo personal", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // entonces hay enlaces a mi correo personal y ninguno a otra dirección.
  await expect(page.locator(`a[href="mailto:${CORREO}"]`).first()).toBeVisible();
  await expect(page.locator(`a[href^="mailto:"]:not([href="mailto:${CORREO}"])`)).toHaveCount(0);
});
