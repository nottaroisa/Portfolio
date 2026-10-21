import { expect, test } from "@playwright/test";

test("los proyectos son mis repositorios fijados en GitHub, en su orden", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // cuando se mira la lista de proyectos,
  const proyectos = page.getByRole("region", { name: "Proyectos" }).getByRole("link");

  // entonces son los tres repositorios fijados en mi perfil de GitHub.
  await expect(proyectos).toHaveText([/Portfolio/, /FoodDeliveryJava/, /Moodboard SrtaJeans/]);
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

test("al pasar de un proyecto a otro con el ratón, solo se ve la vista previa del nuevo", async ({ page }) => {
  // Dada la lista de proyectos con el ratón sobre el primero,
  await page.goto("/");
  const seccion = page.getByRole("region", { name: "Proyectos" });
  const enlaces = seccion.getByRole("link");
  const arbol = (raiz: RegExp) => seccion.locator("pre").filter({ hasText: raiz }).filter({ visible: true });
  await enlaces.nth(0).hover();
  await expect(arbol(/^Portfolio\//)).toHaveCount(1);

  // cuando el ratón pasa al segundo,
  await enlaces.nth(1).hover();
  await page.waitForTimeout(100);

  // entonces hay una sola vista previa a la vista, y es la del segundo.
  expect(await seccion.locator("pre").filter({ visible: true }).count()).toBe(1);
  await expect(arbol(/^EntregaIDE_IFNS\/src\//)).toHaveCount(1);
});

test("la vista previa aparece justo encima del proyecto, sin taparlo, con ratón o con teclado", async ({ page }) => {
  await page.goto("/");
  const seccion = page.getByRole("region", { name: "Proyectos" });
  const enlaces = seccion.getByRole("link");
  const previa = seccion.locator("figure").filter({ visible: true });
  const pegadaEncima = async (fila: number) => {
    await page.waitForTimeout(500); // la previa llega con un muelle
    const caja = (await previa.boundingBox())!;
    const proyecto = (await enlaces.nth(fila).boundingBox())!;
    expect(caja.y + caja.height).toBeLessThanOrEqual(proyecto.y + 1);
    expect(caja.y + caja.height).toBeGreaterThan(proyecto.y - 40);
  };

  // Con el ratón sobre el segundo proyecto, la previa queda encima de su fila.
  await enlaces.nth(1).hover();
  await pegadaEncima(1);

  // Con el teclado, al enfocar el segundo proyecto, también.
  await page.mouse.move(0, 0);
  await expect(previa).toHaveCount(0);
  await enlaces.nth(1).focus();
  await pegadaEncima(1);
});

test("el árbol del repositorio está bien dibujado: ├─ para cada hermano y └─ para el último", async ({ page }) => {
  // Dada la página de un proyecto con su árbol de ficheros,
  await page.goto("/proyectos/food-delivery-java");

  // entonces las ramas siguen las reglas de un árbol de consola.
  expect(await page.locator("pre").first().textContent()).toBe(
    [
      "EntregaIDE_IFNS/src/",
      "├─ clases/",
      "│  ├─ Cliente.java",
      "│  ├─ Usuario.java",
      "│  ├─ Producto.java",
      "│  ├─ Categoria.java",
      "│  ├─ Pedido.java",
      "│  ├─ LineaPedido.java",
      "│  ├─ EstadoPedido.java",
      "│  ├─ Repartidor.java",
      "│  └─ EstadoRepartidor.java",
      "└─ main/",
      "   └─ Main.java",
    ].join("\n"),
  );
});

test("cada proyecto cuenta mi rol real, y el moodboard solo enlaza a su repositorio", async ({ page }) => {
  const rol = (pagina: import("@playwright/test").Page) => pagina.locator("dt", { hasText: "Mi rol" }).locator("xpath=following-sibling::dd[1]");

  // El portfolio, co-desarrollado con Claude por falta de tiempo.
  await page.goto("/proyectos/portfolio");
  await expect(rol(page)).toContainText("Claude");
  await expect(rol(page)).not.toContainText("PENDIENTE");

  // FoodDeliveryJava, un trabajo de clase que hice yo, enlazado a su repositorio.
  await page.goto("/proyectos/food-delivery-java");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FoodDeliveryJava");
  await expect(page.getByRole("link", { name: "Ver el código en GitHub" })).toHaveAttribute("href", "https://github.com/nottaroisa/FoodDeliveryJava");
  await expect(rol(page)).toContainText("Creadora del trabajo");
  await expect(rol(page)).not.toContainText("PENDIENTE");

  // El moodboard: solo el enlace al repositorio, sin demo ni GitHub Pages.
  await page.goto("/proyectos/pgrid-moodboard");
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "Ver el código en GitHub" })).toHaveAttribute("href", "https://github.com/nottaroisa/Moodboard");
  await expect(main).not.toContainText("GitHub Pages");
  await expect(main.getByRole("link", { name: /demo/i })).toHaveCount(0);
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
