import { expect, test } from "@playwright/test";

test("en comunidades aparecen WordPress y GPUL con lo que he hecho en cada una", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // cuando se busca la sección de comunidades,
  const seccion = page.getByRole("region", { name: "Comunidades" });

  // entonces están WordPress (WordCamp y meetups) y GPUL (charlas), cada una con su web.
  await expect(seccion.getByRole("link", { name: /WordPress/ })).toHaveAttribute("href", "https://central.wordcamp.org/");
  await expect(seccion.getByRole("link", { name: /GPUL/ })).toHaveAttribute("href", "https://gpul.org/");
  await expect(seccion).toContainText("WordCamp");
  await expect(seccion).toContainText("meetups");
  await expect(seccion).toContainText("charlas");
});
