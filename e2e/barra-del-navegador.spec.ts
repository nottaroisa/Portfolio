import { expect, test } from "@playwright/test";

// Color del papel del modo claro, el que debe tomar la barra del navegador del móvil.
const PAPEL = "#f4f4f0";

test("al elegir el modo claro, la barra del navegador pasa al color del papel", async ({ page }) => {
  // Dada la web en su modo oscuro de entrada,
  await page.goto("/");

  // cuando se elige el modo claro con el botón,
  await page.getByRole("button", { name: "Cambiar a modo claro" }).click();

  // entonces la barra del navegador toma el color del papel.
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", PAPEL);
});
