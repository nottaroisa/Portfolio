import { expect, test } from "@playwright/test";

// Los iconos animados de animateicons van en los botones de contacto, que son
// los que piden un gesto: escribir, descargar y copiar.
test("los botones de contacto llevan un icono que se mueve al pasar el ratón", async ({ page }) => {
  // Dada la sección de contacto,
  await page.goto("/");
  const contacto = page.getByRole("region", { name: "Contacto" });

  for (const nombre of ["Escríbeme un correo", /Descargar CV/]) {
    const boton = contacto.getByRole("link", { name: nombre });
    const icono = boton.locator("svg[aria-hidden='true']");

    // cada botón tiene su icono, decorativo,
    await expect(icono).toHaveCount(1);

    // y al pasar el ratón por encima, el icono se anima.
    await boton.scrollIntoViewIfNeeded();
    await boton.hover();
    await expect
      .poll(() => icono.evaluate((svg) => [...svg.querySelectorAll("*")].some((el) => (el as SVGElement).style.transform)))
      .toBe(true);
  }
});

// Comprueba que un enlace lleva un único icono decorativo y que se anima al pasar el ratón.
async function seAnimaAlPasar(enlace: import("@playwright/test").Locator) {
  const icono = enlace.locator("svg[aria-hidden='true']");
  await expect(icono).toHaveCount(1);
  // Si el ratón llega antes que las animaciones, se sale y se vuelve a pasar.
  await expect(async () => {
    await enlace.page().mouse.move(0, 0);
    await enlace.scrollIntoViewIfNeeded();
    await enlace.hover();
    await expect
      .poll(() => icono.evaluate((svg) => [svg, ...svg.querySelectorAll("*")].some((el) => !["", "none"].includes((el as SVGElement).style.transform))), { timeout: 1500 })
      .toBe(true);
  }).toPass({ timeout: 15_000 });
}

// Las animaciones de framer-motion llegan después de la primera carga (LazyMotion):
// se espera a que haya llegado todo antes de pasar el ratón.
test("en la página de un proyecto, volver y ver el código llevan icono animado", async ({ page }) => {
  await page.goto("/proyectos/portfolio", { waitUntil: "networkidle" });
  await seAnimaAlPasar(page.getByRole("link", { name: "Volver a los proyectos" }));
  await seAnimaAlPasar(page.getByRole("link", { name: "Ver el código en GitHub" }));
});

test("los certificados y las credenciales llevan icono animado", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await seAnimaAlPasar(page.getByRole("link", { name: "Ver certificado (PDF)" }).first());
  await seAnimaAlPasar(page.getByRole("link", { name: "Ver credencial" }).first());
});

test("al copiar el correo, su icono pasa a una marca de copiado", async ({ page, context }) => {
  // Dado un navegador que deja usar el portapapeles,
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const boton = page.getByRole("region", { name: "Contacto" }).getByRole("button", { name: /Copiar el correo/ });
  const marca = boton.locator("svg[aria-hidden='true'] [data-marca]");

  // antes de copiar no hay marca;
  await expect(boton.locator("svg[aria-hidden='true']")).toHaveCount(1);
  await expect(marca).toHaveCount(0);

  // al pulsarlo, aparece.
  await boton.click();
  await expect(marca).toHaveCount(1);
});

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("los iconos no se mueven", async ({ page }) => {
    await page.goto("/");
    const boton = page.getByRole("region", { name: "Contacto" }).getByRole("link", { name: /Descargar CV/ });
    await boton.scrollIntoViewIfNeeded();
    await boton.hover();
    await page.waitForTimeout(300);
    const movido = await boton
      .locator("svg[aria-hidden='true']")
      .evaluate((svg) => [...svg.querySelectorAll("*")].some((el) => !["", "none"].includes((el as SVGElement).style.transform)));
    expect(movido).toBe(false);
  });
});
