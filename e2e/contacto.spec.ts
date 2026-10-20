import { expect, test } from "@playwright/test";

const CORREO = "isabellanottaro@gmail.com";

test("todos los enlaces de correo llevan al correo personal", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // entonces hay enlaces a mi correo personal y ninguno a otra dirección.
  await expect(page.locator(`a[href^="mailto:${CORREO}"]`).first()).toBeVisible();
  await expect(page.locator(`a[href^="mailto:"]:not([href^="mailto:${CORREO}"])`)).toHaveCount(0);
});

test("escribirme abre un correo con asunto y saludo, también desde Gmail", async ({ page }) => {
  // Dada la sección de contacto,
  await page.goto("/");
  const contacto = page.getByRole("region", { name: "Contacto" });

  // cuando alguien quiere escribirme,
  const escribir = contacto.getByRole("link", { name: "Escríbeme un correo" });
  const gmail = contacto.getByRole("link", { name: /Gmail/ });

  // entonces el correo llega ya con el asunto y un saludo, solo falta redactarlo.
  const correo = new URL((await escribir.getAttribute("href"))!);
  expect(correo.protocol + correo.pathname).toBe(`mailto:${CORREO}`);
  expect(correo.searchParams.get("subject")).toBe("¡Pongámonos en contacto!");
  expect(correo.searchParams.get("body")).toMatch(/^Hola, Isabella:/);

  const enGmail = new URL((await gmail.getAttribute("href"))!);
  expect(enGmail.hostname).toBe("mail.google.com");
  expect(enGmail.searchParams.get("to")).toBe(CORREO);
  expect(enGmail.searchParams.get("su")).toBe("¡Pongámonos en contacto!");
});

test("en contacto se ve que estoy disponible para prácticas", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // cuando se llega a la sección de contacto,
  const contacto = page.getByRole("region", { name: "Contacto" });

  // entonces se ve el estado: disponible para prácticas.
  await expect(contacto.getByText(/Disponible para prácticas/)).toBeVisible();
});

test("al pulsar el correo se copia y avisa de que está copiado", async ({ page, context }) => {
  // Dado un navegador que deja usar el portapapeles,
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const contacto = page.getByRole("region", { name: "Contacto" });

  // cuando se pulsa el correo,
  await contacto.getByRole("button", { name: `Copiar el correo ${CORREO}` }).click();

  // entonces el correo está en el portapapeles y se avisa de que se ha copiado.
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(CORREO);
  await expect(contacto.getByRole("status")).toHaveText(/copiado/);
});
