import { expect, test } from "@playwright/test";

const NOMBRE = "Isabella Federica Nottaro Sánchez";

test("mi nombre completo sale en la portada, en el título y en el pie", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // entonces el titular, el título de la pestaña y el pie llevan el nombre completo,
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(NOMBRE);
  await expect(page).toHaveTitle(new RegExp(`^${NOMBRE}`));
  await expect(page.locator("footer")).toContainText(NOMBRE);

  // y el nombre recortado en el papel también lleva el segundo nombre, en las dos composiciones.
  await expect(page.locator("mask#nombre-apaisado text")).toContainText(["Isabella Federica", "Nottaro Sánchez"]);
  await expect(page.locator("mask#nombre-vertical text")).toHaveText(["Isabella", "Federica", "Nottaro", "Sánchez"]);
});

test("las páginas de proyecto también llevan el nombre completo", async ({ page }) => {
  await page.goto("/proyectos/portfolio");
  await expect(page).toHaveTitle(new RegExp(`${NOMBRE}$`));
  await expect(page.getByRole("navigation", { name: "Navegación del proyecto" })).toContainText(NOMBRE);
});
