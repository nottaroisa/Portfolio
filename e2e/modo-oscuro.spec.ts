import { expect, test } from "@playwright/test";

// Fondo de la cianotipia (#0d1347), tal como lo devuelve el navegador.
const CIANOTIPIA = "rgb(13, 19, 71)";

test.use({ colorScheme: "light" });

test("sin elección guardada, entra en modo oscuro aunque el sistema esté en claro", async ({ page }) => {
  // Dado un sistema en claro y un navegador sin tema guardado (cada test empieza vacío),
  // cuando se abre la portada,
  await page.goto("/");

  // entonces se ve la cianotipia y el botón ofrece volver al claro.
  await expect(page.locator("body")).toHaveCSS("background-color", CIANOTIPIA);
  await expect(page.getByRole("button", { name: "Cambiar a modo claro" })).toBeVisible();
});
