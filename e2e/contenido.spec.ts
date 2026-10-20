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
