import { expect, test } from "@playwright/test";

test("en comunidades aparecen WordPress y GPUL con lo que he hecho en cada una", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // cuando se busca la sección de comunidades,
  const seccion = page.getByRole("region", { name: "Comunidades" });

  // entonces están WordPress Coruña (WordCamp y meetups) y GPUL (charlas), cada una con su web.
  await expect(seccion.getByRole("link", { name: /wpcoruña\.com/ })).toHaveAttribute("href", "https://xn--wpcorua-9za.com/es/");
  await expect(seccion.getByRole("link", { name: /gpul\.org/ })).toHaveAttribute("href", "https://gpul.org/");
  await expect(seccion).toContainText("WordCamp");
  await expect(seccion).toContainText("meetups");
  await expect(seccion).toContainText("charlas");
});

test("mi blog se enlaza desde WordPress, no desde la sección de TikTok", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // entonces el blog está en comunidades, junto a WordPress, y no en "Creo contenido".
  const comunidades = page.getByRole("region", { name: "Comunidades" });
  await expect(comunidades.getByRole("link", { name: /Leer mi blog/ })).toHaveAttribute("href", "https://blogisabellanottaro.blog");
  await expect(page.getByRole("region", { name: "Creo contenido" }).getByRole("link", { name: /blog/i })).toHaveCount(0);
});
