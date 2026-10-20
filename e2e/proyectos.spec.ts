import { expect, test } from "@playwright/test";

test("los proyectos son mis repositorios fijados en GitHub, en su orden", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // cuando se mira la lista de proyectos,
  const proyectos = page.getByRole("region", { name: "Proyectos" }).getByRole("link");

  // entonces son los tres repositorios fijados en mi perfil de GitHub.
  await expect(proyectos).toHaveText([/Portfolio/, /EntregaIDE/, /Moodboard SrtaJeans/]);
});

test("con ratón, la vista previa sigue al cursor y no se repite bajo cada nombre", async ({ page }) => {
  // Dada la portada en un ordenador con ratón,
  await page.goto("/");
  const proyectos = page.getByRole("region", { name: "Proyectos" });

  // cuando todavía no se ha pasado por encima de ningún proyecto,
  // entonces no hay ninguna vista previa a la vista.
  await expect(proyectos.getByText("estructura del repositorio")).toHaveCount(2);
  await expect(proyectos.getByText("estructura del repositorio").first()).toBeHidden();
});

test.describe("en una tablet táctil", () => {
  test.use({ viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true });

  test("se ve la vista previa de los proyectos sin necesidad de ratón", async ({ page }) => {
    // Dada la portada en una tablet sin ratón,
    await page.goto("/");

    // cuando se mira la lista de proyectos,
    const proyectos = page.getByRole("region", { name: "Proyectos" });

    // entonces cada proyecto enseña su vista previa debajo.
    await expect(proyectos.getByText("estructura del repositorio").first()).toBeVisible();
  });
});
