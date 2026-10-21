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

test("las certificaciones de LinkedIn aparecen con su entidad, su fecha y su credencial", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");
  const certificaciones = page.getByRole("region", { name: "Certificaciones" }).getByRole("listitem");

  // entonces están las tres, con quién las expide y cuándo,
  await expect(certificaciones).toHaveCount(3);
  const certificacion = (texto: string) => certificaciones.filter({ hasText: texto });
  await expect(certificacion("WordPress Credits")).toContainText(/septiembre de 2026/i);
  await expect(certificacion("Generative AI Foundations")).toContainText("Pearson");
  await expect(certificacion("Industrias Culturales y Creativas")).toContainText("Fundación INCYDE");

  // y enlazan a su credencial cuando la tienen.
  await expect(certificacion("WordPress Credits").getByRole("link")).toHaveAttribute("href", "https://learn.wordpress.org/certificate/51a729a8/");
  await expect(certificacion("Generative AI Foundations").getByRole("link")).toHaveAttribute(
    "href",
    "https://www.credly.com/badges/35a52464-3aa3-4bde-b13f-9ecc2665d093",
  );

  // Eran la formación complementaria que faltaba por completar en estudios.
  await expect(page.getByRole("region", { name: "Estudios" })).not.toContainText("Formación complementaria");
});
