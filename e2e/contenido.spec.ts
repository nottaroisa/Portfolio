import { expect, test } from "@playwright/test";

test("la sección dice que creo contenido y resume mi cuenta de TikTok", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // cuando se busca la sección de contenido,
  const seccion = page.getByRole("region", { name: "Creo contenido" });

  // entonces resume la cuenta: usuario, seguidores, me gusta y vídeos.
  await expect(seccion).toContainText("@srtajeans");
  await expect(seccion).toContainText("137,4 mil");
  await expect(seccion).toContainText("3,4 M");
  await expect(seccion).toContainText("240");
});

test("los vídeos de TikTok no se cargan hasta que se pulsan", async ({ page }) => {
  // TikTok queda fuera del test: solo importa qué reproductor se pide.
  await page.route("https://www.tiktok.com/**", (peticion) => peticion.abort());
  await page.goto("/");
  const seccion = page.getByRole("region", { name: "Creo contenido" });

  // Dado que hay tres vídeos y ningún reproductor cargado,
  const videos = seccion.getByRole("button", { name: /^Reproducir/ });
  await expect(videos).toHaveCount(3);
  await expect(seccion.locator("iframe")).toHaveCount(0);

  // cuando se pulsa el primero,
  await videos.first().click();

  // entonces se carga su reproductor de TikTok.
  await expect(seccion.locator('iframe[src^="https://www.tiktok.com/player/v1/7021965904724495621"]')).toBeVisible();
});
