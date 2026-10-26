import { expect, test, type Page } from "@playwright/test";

// Los modelos 3D de threejsassets se ven junto al título de su sección,
// sombreados en el azul de la web. three.js, el descompresor y los modelos
// solo se piden al llegar.
const secciones: [string, string][] = [
  ["Proyectos", "laptop"],
  ["Experiencia", "monitor keyboard"],
  ["Estudios", "books-stack"],
  ["Creo contenido", "headphones"],
];

const lienzo = (page: Page, modelo: string) => page.locator(`canvas[data-modelo="${modelo}"]`);

// Píxeles pintados del lienzo y si todos son azules (más azul que rojo y verde).
const pintado = (page: Page, modelo: string) =>
  lienzo(page, modelo).evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
    let pixeles = 0;
    let azules = 0;
    let firma = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      pixeles++;
      if (d[i + 2] > d[i] && d[i + 2] > d[i + 1]) azules++;
      firma = (firma * 31 + d[i] + d[i + 1] * 7 + d[i + 2] * 13 + i) % 1_000_000_007;
    }
    return { pixeles, azules, firma };
  });

test("al entrar no se descarga nada del 3D", async ({ page }) => {
  const pedidos: string[] = [];
  page.on("request", (r) => pedidos.push(new URL(r.url()).pathname));
  await page.goto("/", { waitUntil: "networkidle" });
  expect(pedidos.filter((p) => p.startsWith("/modelos/") || p.startsWith("/draco/"))).toEqual([]);
});

for (const [seccion, modelo] of secciones) {
  test(`en ${seccion}, su modelo gira sombreado en azul, sin ASCII`, async ({ page }) => {
    // Dada la portada,
    await page.goto("/");

    // cuando se llega a la sección,
    await page.getByRole("heading", { level: 2, name: seccion, exact: true }).scrollIntoViewIfNeeded();

    // entonces junto al título hay un modelo pintado, decorativo y sin caracteres,
    const figura = page.locator("figure[aria-hidden='true']", { has: lienzo(page, modelo) });
    await expect(figura).toHaveCount(1);
    await expect(figura.locator("pre")).toHaveCount(0);
    await expect.poll(async () => (await pintado(page, modelo)).pixeles, { timeout: 15_000 }).toBeGreaterThan(500);

    // todo en azul,
    const { pixeles, azules, firma } = await pintado(page, modelo);
    expect(azules / pixeles).toBeGreaterThan(0.98);

    // y que se mueve.
    await expect.poll(async () => (await pintado(page, modelo)).firma, { timeout: 5_000 }).not.toBe(firma);
  });
}

test.describe("con movimiento reducido", () => {
  test.use({ reducedMotion: "reduce" });

  test("el modelo se pinta pero no gira", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("heading", { level: 2, name: "Estudios", exact: true }).scrollIntoViewIfNeeded();
    await expect.poll(async () => (await pintado(page, "books-stack")).pixeles, { timeout: 15_000 }).toBeGreaterThan(500);
    const antes = (await pintado(page, "books-stack")).firma;
    await page.waitForTimeout(1500);
    expect((await pintado(page, "books-stack")).firma).toBe(antes);
  });
});
