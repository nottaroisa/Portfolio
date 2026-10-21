import { expect, test, type Locator } from "@playwright/test";

// El certificado en PDF se abre en una pestaña nueva desde una miniatura de su primera página.
async function esCertificadoConMiniatura(entrada: Locator, nombre: string) {
  const enlace = entrada.getByRole("link", { name: /Ver certificado/ });
  await expect(enlace).toHaveAttribute("href", `/certificados/${nombre}.pdf`);
  await expect(enlace).toHaveAttribute("target", "_blank");
  await expect(enlace.locator(`img[src="/certificados/${nombre}.jpg"]`)).toBeVisible();
}

test("el inglés B2 es de 2020 y enseña el certificado de Trinity", async ({ page }) => {
  await page.goto("/");
  const ingles = page.getByRole("region", { name: "Estudios" }).getByRole("listitem").filter({ hasText: "Inglés B2" });

  await expect(ingles).toContainText("2020");
  await esCertificadoConMiniatura(ingles, "trinity-b2");
});

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
  await expect(certificacion("Industrias Culturales y Creativas")).toContainText(/noviembre de 2021/i);

  // y enlazan a su credencial o a su certificado en PDF, según lo que tengan.
  await expect(certificacion("Generative AI Foundations").getByRole("link")).toHaveAttribute(
    "href",
    "https://www.credly.com/badges/35a52464-3aa3-4bde-b13f-9ecc2665d093",
  );
  await esCertificadoConMiniatura(certificacion("WordPress Credits"), "wordpress-credits");
  await esCertificadoConMiniatura(certificacion("Industrias Culturales y Creativas"), "incyde");

  // Eran la formación complementaria que faltaba por completar en estudios.
  await expect(page.getByRole("region", { name: "Estudios" })).not.toContainText("Formación complementaria");
});
