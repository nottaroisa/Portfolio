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

test("con el modo claro elegido, la barra del navegador sigue clara al recargar", async ({ page }) => {
  // Dado que se eligió el modo claro,
  await page.goto("/");
  await page.getByRole("button", { name: "Cambiar a modo claro" }).click();

  // cuando se recarga la página y termina de cargar (el botón solo aparece tras hidratar),
  await page.reload();
  await expect(page.getByRole("button", { name: "Cambiar a modo oscuro" })).toBeVisible();

  // entonces hay una sola barra y mantiene el color del papel.
  const barra = page.locator('meta[name="theme-color"]');
  await expect(barra).toHaveCount(1);
  await expect(barra).toHaveAttribute("content", PAPEL);
});
