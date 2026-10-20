import { expect, test } from "@playwright/test";

test("los proyectos son mis repositorios fijados en GitHub, en su orden", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // cuando se mira la lista de proyectos,
  const proyectos = page.getByRole("region", { name: "Proyectos" }).getByRole("link");

  // entonces son los tres repositorios fijados en mi perfil de GitHub.
  await expect(proyectos).toHaveText([/Portfolio/, /EntregaIDE/, /Moodboard SrtaJeans/]);
});
