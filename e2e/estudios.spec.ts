import { expect, test } from "@playwright/test";

test("los estudios muestran DAM sin siglas y el Bachillerato del IES Eusebio da Guarda", async ({ page }) => {
  // Dada la sección de estudios,
  await page.goto("/");
  const estudios = page.getByRole("region", { name: "Estudios" });

  // entonces el ciclo aparece por su nombre, sin "CFGS",
  await expect(estudios.getByRole("heading", { name: "Desarrollo de Aplicaciones Multiplataforma", exact: true })).toBeVisible();
  await expect(estudios).not.toContainText("CFGS");

  // y los estudios previos son el Bachillerato de Ciencias Sociales (2023 – 2025).
  const bachillerato = estudios.getByRole("listitem").filter({ hasText: "Bachillerato de Ciencias Sociales" });
  await expect(bachillerato).toContainText("IES Eusebio da Guarda");
  await expect(bachillerato).toContainText("2023 – 2025");
  await expect(estudios).not.toContainText("estudios previos");
});
