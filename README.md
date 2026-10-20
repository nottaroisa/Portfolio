<div align="center">

# Isabella Nottaro Sánchez

**Portfolio web** · estudiante de 2º de Desarrollo de Aplicaciones Multiplataforma

*"No entiendo la tecnología sin la creatividad."*

### [Ver la web: isabellanottaro.vercel.app](https://isabellanottaro.vercel.app)

[LinkedIn](https://www.linkedin.com/in/isabellanottarosanchez/) · [GitHub](https://github.com/nottaroisa) · [Correo](mailto:isabellanottaro@gmail.com) · [TikTok](https://www.tiktok.com/@SrtaJeans) · [Blog](https://blogisabellanottaro.blog)

</div>

![Portada del portfolio: un campo de caracteres ASCII en cobalto sobre papel que dibuja el monograma de mis iniciales](.github/capturas/portada-claro.jpg)

## Sobre mí

Soy Isabella. Estudio 2º de **Desarrollo de Aplicaciones Multiplataforma** en CPR Liceo La Paz (2025–2027) y me oriento al desarrollo **full stack**, con base en Java, MySQL, HTML y CSS. Busco prácticas (FCT) de backend o full stack.

Desde 2020 hago **contenido tecnológico en castellano** en TikTok ([@SrtaJeans](https://www.tiktok.com/@SrtaJeans)) y he colaborado con marcas como Xiaomi, Huawei, Telefónica, PcComponentes, Hyte, AliExpress, Temu y Lewitt. Explicar tecnología me ha enseñado a organizarme con autonomía, a cuidar cada entrega y a contar las cosas de forma que se entiendan.

## El proyecto

Mi portfolio no es una plantilla: está hecho de **caracteres**. La portada es un campo ASCII dibujado en un canvas que forma mi monograma y se reordena al pasar el ratón: donde lo mueves, los caracteres se convierten en símbolos de código y dejan una estela. Al hacer scroll, el papel cubre el campo y los caracteres siguen vivos solo **dentro de las letras de mi nombre**.

Todo está impreso a **dos tintas**, cobalto y negro sobre papel. En **modo oscuro** la web se convierte en una cianotipia, el negativo de esa impresión: fondo azul de Prusia y tinta de papel.

| Mi nombre escrito con el campo ASCII (modo oscuro) | Página de un proyecto (modo oscuro) |
|---|---|
| ![El nombre Isabella Nottaro Sánchez formado por caracteres ASCII sobre azul de Prusia](.github/capturas/nombre-oscuro.jpg) | ![Página del proyecto Moodboard SrtaJeans con imágenes tramadas a dos tintas](.github/capturas/proyecto-oscuro.jpg) |

![Lista de proyectos con la vista previa de EntregaIDE siguiendo al cursor](.github/capturas/proyectos-claro.jpg)

### Qué tiene

- **Campo ASCII propio** en canvas 2D: convierte una imagen en caracteres según su densidad, solo redibuja las celdas que cambian y se detiene cuando no hay movimiento.
- **Máscara del nombre** ligada al scroll, con framer-motion.
- **Proyectos con vista previa** que sigue al cursor, hecha con material real de cada uno: la estructura de ficheros del repositorio o sus fotos tramadas a dos tintas. Son los repositorios fijados en mi perfil de GitHub.
- **Una página por proyecto** (`/proyectos/<id>`), generada al compilar, con el problema, mi rol, el resultado y el enlace al código.
- **Creo contenido**: resumen de mi cuenta de TikTok con cifras que se "calculan" al verse, y tres vídeos con portada en ASCII que solo cargan el reproductor de TikTok al pulsarlos (sin scripts ni cookies de TikTok hasta entonces).
- **Comunidades** como credenciales de evento que cuelgan de su cinta.
- **Contacto** con estado de disponibilidad y el correo que se copia al pulsarlo.
- **Modo claro y oscuro** con un botón fijo arriba a la derecha. Entra en modo oscuro y recuerda la elección; la barra del navegador del móvil acompaña al tema.
- **Responsive**: en el móvil el campo responde al tocar y el nombre se recompone en tres líneas; sin ratón (móvil o tablet), las vistas previas de los proyectos van debajo de cada uno.

<p align="center">
  <img src=".github/capturas/movil-claro.jpg" alt="Portada en el móvil, modo claro" width="260">
  &nbsp;&nbsp;
  <img src=".github/capturas/movil-oscuro.jpg" alt="Nombre en ASCII en el móvil, modo oscuro" width="260">
</p>

### Accesibilidad y rendimiento

- **Lighthouse:** 100 en accesibilidad, buenas prácticas y SEO, y 99–100 en rendimiento, en móvil y escritorio.
- **Contraste WCAG AA** comprobado texto a texto en los dos temas. Texto principal a más de 15:1.
- Respeta **`prefers-reduced-motion`**: sin animación de entrada, sin estela y sin escalado.
- El canvas es decorativo (`aria-hidden`): el nombre, los textos y todos los enlaces están en el HTML y se pueden recorrer con el teclado.

## Tecnologías

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) con exportación estática |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com) |
| Animación | [framer-motion](https://motion.dev), cargado en modo ligero (`LazyMotion`) |
| Gráficos | Canvas 2D propio (campo ASCII y tramado ordenado de Bayer) |
| Tipografía | [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) y [Space Mono](https://fonts.google.com/specimen/Space+Mono) |
| Lenguaje | TypeScript |

## Estructura

```
app/
  page.tsx                  portada
  proyectos/[id]/page.tsx   una página por proyecto
  globals.css               tintas del modo claro y oscuro
components/
  ascii/CampoAscii.tsx      motor del campo ASCII
  Hero.tsx                  portada con la máscara del nombre
  ListaProyectos.tsx        lista con vista previa flotante
  TramaImagen.tsx           imágenes impresas a dos tintas
  CreoContenido.tsx         TikTok: resumen, vídeos y marcas
  VideoTikTok.tsx           vídeo que carga TikTok solo al pulsarlo
  Comunidades.tsx           comunidades como credenciales de evento
  Contacto.tsx              correo para copiar, estado y redes
  BotonTema.tsx             botón de modo claro/oscuro
lib/
  data.ts                   todo el contenido: proyectos, experiencia, estudios y enlaces
  tema.ts                   lógica del tema
public/
  cv-isabella-nottaro.pdf   CV descargable
e2e/                        tests de aceptación con Playwright, uno por funcionalidad
```

## Ejecutar en local

```bash
npm install
npm run dev
```

Se abre en http://localhost:3000.

Para generar la web estática:

```bash
npm run build
npx serve out
```

`npm run build` crea la carpeta `out/` con la web completa, lista para cualquier hosting estático.

## Pruebas

Tests de aceptación con [Playwright](https://playwright.dev), en `e2e/`. La primera vez hay que descargar el navegador:

```bash
npx playwright install chromium
```

Contra la web en local (arranca `npm run dev` si no está en marcha):

```bash
npm test
```

Contra otra dirección, por ejemplo la publicada (en PowerShell: `$env:BASE_URL="https://isabellanottaro.vercel.app"; npm test`):

```bash
BASE_URL=https://isabellanottaro.vercel.app npm test
```

## Desplegar

La web está publicada en Vercel: **[isabellanottaro.vercel.app](https://isabellanottaro.vercel.app)**. Cada `git push` a la rama `main` la actualiza sola.

Para desplegarla en otro sitio: en Vercel se importa el repositorio y detecta Next.js sin configuración; en cualquier otro hosting estático basta con subir el contenido de `out/`.

## Créditos

- Las ideas de la máscara de texto, la vista previa que sigue al cursor y el texto que se descifra parten de componentes de [ui-layouts](https://github.com/ui-layouts/ui-layouts) (licencia MIT), adaptados y reescritos para este proyecto.
- Fuentes de [Google Fonts](https://fonts.google.com) bajo licencia SIL Open Font License.

---

<div align="center">

Primera versión · octubre de 2026 · hecho por Isabella Nottaro Sánchez

</div>
