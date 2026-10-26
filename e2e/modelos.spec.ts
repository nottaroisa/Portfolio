import { expect, test, type Page } from "@playwright/test";

// Los modelos 3D de threejsassets se dibujan con caracteres junto al título de
// su sección. three.js, el descompresor y los modelos solo se piden al llegar.
const secciones: [string, string][] = [
  ["Proyectos", "laptop"],
  ["Experiencia", "monitor keyboard"],
  ["Estudios", "books-stack"],
  ["Creo contenido", "headphones"],
];

const dibujo = (page: Page, modelo: string) => page.locator(`pre[data-modelo="${modelo}"]`);
const caracteres = (page: Page, modelo: string) => dibujo(page, modelo).evaluate((pre) => pre.textContent ?? "");
const tinta = (texto: string) => texto.replace(/\s/g, "").length;

test("al entrar no se descarga nada del 3D", async ({ page }) => {
  const pedidos: string[] = [];
  page.on("request", (r) => pedidos.push(new URL(r.url()).pathname));
  await page.goto("/", { waitUntil: "networkidle" });
  expect(pedidos.filter((p) => p.startsWith("/modelos/") || p.startsWith("/draco/"))).toEqual([]);
});

for (const [seccion, modelo] of secciones) {
  test(`en ${seccion}, su modelo gira dibujado con caracteres`, async ({ page }) => {
    // Dada la portada,
    await page.goto("/");

    // cuando se llega a la sección,
    const titulo = page.getByRole("heading", { level: 2, name: seccion, exact: true });
    await titulo.scrollIntoViewIfNeeded();

    // entonces junto al título hay un dibujo de caracteres, decorativo,
    const figura = page.locator("figure[aria-hidden='true']", { has: dibujo(page, modelo) });
    await expect(figura).toHaveCount(1);
    await expect.poll(async () => tinta(await caracteres(page, modelo)), { timeout: 15_000 }).toBeGreaterThan(40);

    // que se mueve.
    const antes = await caracteres(page, modelo);
    await expect.poll(() => caracteres(page, modelo), { timeout: 5_000 }).not.toBe(antes);
  });
}

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("el modelo se dibuja pero no gira", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { level: 2, name: "Estudios", exact: true }).scrollIntoViewIfNeeded();
    await expect.poll(async () => tinta(await caracteres(page, "books-stack")), { timeout: 15_000 }).toBeGreaterThan(40);
    const antes = await caracteres(page, "books-stack");
    await page.waitForTimeout(1500);
    expect(await caracteres(page, "books-stack")).toBe(antes);
  });
});
