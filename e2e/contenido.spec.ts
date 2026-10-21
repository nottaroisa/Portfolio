import { expect, test } from "@playwright/test";

test("la sección dice que creo contenido y resume mi cuenta de TikTok", async ({ page }) => {
  // Dada la portada,
  await page.goto("/");

  // cuando se busca la sección de contenido,
  const seccion = page.getByRole("region", { name: "Creo contenido" });

  // entonces resume la cuenta: usuario, seguidores, me gusta y vídeos.
  await expect(seccion).toContainText("@srtajeans");
  await expect(seccion).toContainText("137,4 mil");
  await expect(seccion).toContainText("3,4 M");
  await expect(seccion).toContainText("240");
});

test("los vídeos de TikTok no se cargan hasta que se pulsan", async ({ page }) => {
  // TikTok queda fuera del test: solo importa qué reproductor se pide.
  await page.route("https://www.tiktok.com/**", (peticion) => peticion.abort());
  await page.goto("/");
  const seccion = page.getByRole("region", { name: "Creo contenido" });

  // Dado que los cuatro vídeos se ven aquí y no hay ningún reproductor cargado,
  const videos = seccion.getByRole("button", { name: /^Reproducir/ });
  await expect(videos).toHaveCount(4);
  await expect(seccion.locator("iframe")).toHaveCount(0);

  // cuando se pulsa el primero, el de los interruptores Blue,
  await videos.first().click();

  // entonces se carga su reproductor de TikTok aquí mismo, sin salir de la web.
  await expect(seccion.locator('iframe[src^="https://www.tiktok.com/player/v1/7021965904724495621"]')).toBeVisible();
});

test("cada marca enlaza a su web y a los vídeos en los que sale", async ({ page }) => {
  // Dada la lista de marcas con las que he trabajado,
  await page.goto("/");
  const marcas = page.getByRole("list", { name: "Marcas con las que he trabajado" }).locator(":scope > li");
  await expect(marcas).toHaveCount(8);
  await expect(marcas.filter({ hasText: /^Hyte/ })).toHaveCount(0);
  const video = (id: string) => `https://www.tiktok.com/@srtajeans/video/${id}`;
  const marca = (nombre: string) => marcas.filter({ hasText: new RegExp(`^${nombre}`) });

  // entonces cada una lleva a su web y al vídeo en el que sale.
  await expect(marca("Xiaomi").getByRole("link", { name: /mi\.com/ })).toHaveAttribute("href", "https://www.mi.com/es/");
  await expect(marca("Xiaomi").getByRole("link", { name: /Xiaomi 17 Ultra/ })).toHaveAttribute("href", video("7610354376309345558"));
  await expect(marca("Telefónica").getByRole("link").first()).toHaveAttribute("href", video("7177478672172158213"));
  await expect(marca("Lewitt").getByRole("link").first()).toHaveAttribute("href", video("7018246201665457414"));
  await expect(marca("Lewitt").getByRole("link", { name: /lewitt-audio\.com/ })).toHaveAttribute("href", "https://www.lewitt-audio.com/");
  await expect(marca("Eneryeti").getByRole("link").first()).toHaveAttribute("href", video("7155179017514126597"));
  await expect(marca("Eneryeti").getByRole("link", { name: /eneryeti\.es/ })).toHaveAttribute("href", "https://eneryeti.es/");
  await expect(page.getByText(/EnerYeti/)).toHaveCount(0);

  // Con PcComponentes no hay vídeo: fue una historia de Instagram.
  await expect(marca("PcComponentes")).toContainText("Historia de Instagram");
});

test("cada vídeo enseña una miniatura de su portada antes de reproducirlo", async ({ page }) => {
  await page.goto("/");
  const videos = page.getByRole("region", { name: "Creo contenido" }).getByRole("button", { name: /^Reproducir/ });

  // Cada portada lleva su propia miniatura, servida desde la web (no desde TikTok).
  for (const id of ["7021965904724495621", "7610354376309345558", "7611105353064779010", "7142590131092999430"]) {
    await expect(videos.locator(`img[src="/contenido/${id}.jpg"]`)).toHaveCount(1);
  }
});

test("todos los vídeos se ven aquí, también el de los interruptores Blue y el del PC pecera", async ({ page }) => {
  await page.goto("/");
  const seccion = page.getByRole("region", { name: "Creo contenido" });

  // Ninguna portada saca de la web: todas cargan el vídeo aquí.
  await expect(seccion.getByRole("button", { name: /^Reproducir: Los interruptores Blue/ })).toHaveCount(1);
  await expect(seccion.getByRole("button", { name: /^Reproducir: .*pecera/ })).toHaveCount(1);
  await expect(seccion.getByRole("link", { name: /^Ver en TikTok: / })).toHaveCount(0);
});
