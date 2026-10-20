"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { alCambiarTema } from "@/lib/tema";

// Densidad de tinta, de papel vacío a lleno.
const RAMPA = " .·:;-=+*#%@";
// Lo que aparece donde pasa el ratón: caracteres de código.
const CODIGO = "{}[]<>/;=+*01#&$%";
const GLIFOS = Array.from(new Set((RAMPA + CODIGO).split("")));
const indice = new Map(GLIFOS.map((g, i) => [g, i]));

type Props = {
  /** Imagen de origen (tu logo o una foto). Si falta o no carga, se dibuja el monograma. */
  fuente?: string;
  className?: string;
  /** 0–1: cuánto se rellena el campo de caracteres densos (lo usa la máscara del nombre). */
  relleno?: MotionValue<number>;
};

type Celdas = {
  cols: number;
  rows: number;
  cw: number;
  ch: number;
  tam: number; // tamaño de letra en px
  base: Float32Array; // densidad de la imagen, 0–1
  textura: Float32Array; // densidad de relleno de cada celda, del suelo (0.45 o 0.72) a 1
  energia: Float32Array; // perturbación del ratón, 0–1, decae sola
  pintado: Int16Array; // glifo dibujado en cada celda, para no repetir trabajo
};

// Campo de caracteres que dibuja una imagen en ASCII y reacciona al puntero.
// Solo redibuja las celdas que cambian y se detiene cuando no hay movimiento.
export function CampoAscii({ fuente, className, relleno }: Props) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    // Las tintas cambian con el tema (impresión o cianotipia): se leen de las variables CSS.
    let papel = "";
    let cobalto = "";
    let tinta = "";
    function leerTintas() {
      const v = getComputedStyle(document.documentElement);
      papel = v.getPropertyValue("--papel").trim() || "#f4f4f0";
      cobalto = v.getPropertyValue("--cobalto").trim() || "#1d2cf3";
      tinta = v.getPropertyValue("--tinta").trim() || "#141414";
    }
    leerTintas();
    const familiaMono = css.getPropertyValue("--font-space-mono").trim() || "monospace";
    const familiaSerif = css.getPropertyValue("--font-instrument").trim() || "serif";
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // En pantallas táctiles (móviles, normalmente con menos CPU) no hay entrada
    // animada: el campo aparece ya resuelto y responde al tocar y arrastrar.
    const tactil = window.matchMedia("(pointer: coarse)").matches;

    let celdas: Celdas | null = null;
    let atlas: HTMLCanvasElement | null = null;
    let imagen: HTMLImageElement | null = null;
    let raf = 0;
    let rellenoActual = relleno?.get() ?? 0;
    let primeraVez = true;
    // Hasta cuándo se considera que el ratón se está moviendo: solo entonces
    // los símbolos parpadean. En la entrada cada celda cambia pocas veces.
    let ratonHasta = 0;
    let cancelado = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Atlas con cada glifo pintado en las dos tintas: dibujar es copiar.
    function crearAtlas(cw: number, ch: number, tam: number) {
      const a = document.createElement("canvas");
      a.width = Math.ceil(cw * dpr) * GLIFOS.length;
      a.height = Math.ceil(ch * dpr) * 2;
      const c = a.getContext("2d")!;
      c.scale(dpr, dpr);
      c.font = `${tam}px ${familiaMono}`;
      c.textBaseline = "middle";
      c.textAlign = "center";
      [cobalto, tinta].forEach((color, fila) => {
        c.fillStyle = color;
        GLIFOS.forEach((g, i) => c.fillText(g, i * Math.ceil(cw * dpr) / dpr + cw / 2, fila * Math.ceil(ch * dpr) / dpr + ch / 2));
      });
      return a;
    }

    // Densidad de cada celda a partir de la imagen (o del monograma).
    function calcularBase(cols: number, rows: number, cw: number, ch: number) {
      const o = document.createElement("canvas");
      o.width = cols;
      o.height = rows;
      const c = o.getContext("2d", { willReadFrequently: true })!;
      c.fillStyle = "#fff";
      c.fillRect(0, 0, cols, rows);
      // Las celdas son más altas que anchas: se compensa para no deformar.
      const aspecto = cw / ch;
      // En pantallas anchas la figura ocupa la parte derecha (composición
      // asimétrica); en las estrechas, casi todo el ancho.
      const estrecha = cw * cols < 640;
      const zonaX = cols * (estrecha ? 0.08 : 0.38);
      const zonaW = cols * (estrecha ? 0.84 : 0.6);
      if (imagen && imagen.naturalWidth > 0) {
        const w = Math.min(zonaW, (rows * 0.92 * imagen.naturalWidth) / imagen.naturalHeight / aspecto);
        const h = (w * imagen.naturalHeight * aspecto) / imagen.naturalWidth;
        c.drawImage(imagen, zonaX + (zonaW - w) / 2, (rows - h) / 2, w, h);
      } else {
        // Monograma provisional "IN" hasta que llegue el logo.
        c.save();
        c.translate(zonaX + zonaW / 2, rows / 2);
        c.scale(1, aspecto);
        c.fillStyle = "#000";
        c.textAlign = "center";
        c.textBaseline = "middle";
        // Tamaño que cabe a lo alto y a lo ancho de la zona.
        const alto = rows / aspecto;
        c.font = `italic 100px ${familiaSerif}`;
        const anchoA100 = c.measureText("IN").width;
        // 0.82 deja sitio a la inclinación de la cursiva, que mide más que su caja.
        const tam = Math.min(alto * 0.95, (zonaW * 0.82 * 100) / anchoA100);
        c.font = `italic ${Math.round(tam)}px ${familiaSerif}`;
        c.fillText("IN", 0, tam * 0.04);
        c.restore();
      }
      const datos = c.getImageData(0, 0, cols, rows).data;
      const base = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        const r = datos[i * 4];
        const g = datos[i * 4 + 1];
        const b = datos[i * 4 + 2];
        const a = datos[i * 4 + 3] / 255;
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        // Un poco de textura en el papel para que todo se lea como pantalla de caracteres.
        const grano = ((i * 2654435761) >>> 0) % 997 < 60 ? 0.12 : 0;
        base[i] = Math.min(1, (1 - lum) * a + grano);
      }
      return base;
    }

    function preparar() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // En el móvil, caracteres más pequeños para que el nombre se lea dentro de las letras.
      const tam = rect.width < 640 ? 9 : 12;
      ctx!.font = `${tam}px ${familiaMono}`;
      const cw = Math.max(5, ctx!.measureText("M").width);
      const ch = Math.round(tam * 1.18);
      const cols = Math.ceil(rect.width / cw);
      const rows = Math.ceil(rect.height / ch);
      atlas = crearAtlas(cw, ch, tam);
      // En el móvil las letras del nombre miden pocas celdas: el relleno es más
      // denso (solo # % @) para que cada letra se lea como una mancha.
      const suelo = rect.width < 640 ? 0.72 : 0.45;
      celdas = {
        cols,
        rows,
        cw,
        ch,
        tam,
        base: calcularBase(cols, rows, cw, ch),
        textura: Float32Array.from({ length: cols * rows }, (_, i) => {
          // Ruido por celda más una ondulación suave para que el relleno tenga ritmo.
          const h = (Math.imul(i, 2654435761) >>> 0) / 4294967296;
          const ola = 0.5 + 0.5 * Math.sin((i % cols) / 9 + Math.floor(i / cols) / 5);
          return suelo + (1 - suelo) * (0.64 * h + 0.36 * ola);
        }),
        energia: new Float32Array(cols * rows),
        pintado: new Int16Array(cols * rows).fill(-1),
      };
      ctx!.fillStyle = papel;
      ctx!.fillRect(0, 0, rect.width, rect.height);
      if (!reducido && !tactil && primeraVez) {
        primeraVez = false;
        // Entrada (solo la primera vez): todo empieza como ruido de código y se resuelve en la imagen.
        for (let i = 0; i < celdas.energia.length; i++) celdas.energia[i] = 0.55 + ((i * 7919) % 450) / 1000;
      }
      // El primer pintado va en el siguiente fotograma: así preparar la rejilla
      // y dibujarla son dos tareas cortas en vez de una larga.
      ultimo = 0;
      arrancar();
    }

    function glifoDe(i: number, t: number): [number, number] {
      const c = celdas!;
      const e = c.energia[i];
      if (e > 0.12) {
        // Cerca del ratón: caracteres de código que cambian mientras haya energía.
        const paso = e > 0.4 && t < ratonHasta ? Math.floor(t / 70) : 0;
        // Hash entero para que los símbolos no formen diagonales repetidas.
        const h = Math.imul(i ^ (paso * 2654435761), 2246822519) >>> 0;
        const g = CODIGO[(h >>> 7) % CODIGO.length];
        return [indice.get(g)!, e > 0.5 ? 1 : 0];
      }
      const d = Math.max(c.base[i], rellenoActual * c.textura[i]);
      const g = RAMPA[Math.min(RAMPA.length - 1, Math.round(d * (RAMPA.length - 1)))];
      return [indice.get(g)!, 0];
    }

    // La energía decae con el tiempo real, no por fotograma: así la imagen se
    // resuelve igual de rápido aunque el navegador vaya a pocos fotogramas.
    let ultimo = 0;
    function pintar(t: number) {
      const c = celdas;
      if (!c || !atlas) return false;
      const sw = Math.ceil(c.cw * dpr);
      const sh = Math.ceil(c.ch * dpr);
      const dt = ultimo ? Math.min(1000, t - ultimo) : 16.7;
      ultimo = t;
      const decaimiento = Math.pow(0.955, dt / 16.7);
      let vivo = false;
      ctx!.fillStyle = papel;
      for (let i = 0; i < c.cols * c.rows; i++) {
        if (c.energia[i] > 0) {
          c.energia[i] *= decaimiento;
          if (c.energia[i] < 0.02) c.energia[i] = 0;
          else vivo = true;
        }
        const [g, tintaFila] = glifoDe(i, t);
        const clave = g + tintaFila * GLIFOS.length;
        if (c.pintado[i] === clave) continue;
        c.pintado[i] = clave;
        const x = (i % c.cols) * c.cw;
        const y = Math.floor(i / c.cols) * c.ch;
        ctx!.fillRect(x, y, c.cw + 0.5, c.ch);
        if (GLIFOS[g] !== " ") ctx!.drawImage(atlas, g * sw, tintaFila * sh, sw, sh, x, y, c.cw, c.ch);
      }
      return vivo;
    }

    // Respaldo: si el navegador no da fotogramas (pestaña en segundo plano,
    // ventana tapada), un temporizador termina la animación igualmente.
    let respaldo = 0;
    function programar() {
      raf = requestAnimationFrame(bucle);
      window.clearTimeout(respaldo);
      respaldo = window.setTimeout(() => {
        if (!raf) return;
        cancelAnimationFrame(raf);
        bucle(performance.now());
      }, 250);
    }

    function bucle(t: number) {
      raf = 0;
      if (pintar(t)) programar();
      else ultimo = 0; // al volver a arrancar no se cuenta el tiempo parado
    }

    function arrancar() {
      if (!raf && !cancelado) programar();
    }

    // El puntero deja una estela de energía en un radio a su alrededor.
    function alMover(e: PointerEvent) {
      const c = celdas;
      if (!c || reducido) return;
      const rect = canvas!.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) return;
      ratonHasta = performance.now() + 500;
      const radio = rect.width < 640 ? 70 : 110;
      const c0 = Math.max(0, Math.floor((px - radio) / c.cw));
      const c1 = Math.min(c.cols - 1, Math.ceil((px + radio) / c.cw));
      const r0 = Math.max(0, Math.floor((py - radio) / c.ch));
      const r1 = Math.min(c.rows - 1, Math.ceil((py + radio) / c.ch));
      for (let r = r0; r <= r1; r++) {
        for (let col = c0; col <= c1; col++) {
          const dx = col * c.cw + c.cw / 2 - px;
          const dy = r * c.ch + c.ch / 2 - py;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > radio) continue;
          const i = r * c.cols + col;
          c.energia[i] = Math.max(c.energia[i], 1 - d / radio);
        }
      }
      arrancar();
    }

    // Solo se rehace la rejilla si el tamaño cambia de verdad (el observador
    // también avisa nada más empezar a observar).
    // Al cambiar de tema se rehace el atlas con las tintas nuevas y se repinta todo.
    function recolorear() {
      const c = celdas;
      if (!c) return;
      leerTintas();
      const rect = canvas!.getBoundingClientRect();
      atlas = crearAtlas(c.cw, c.ch, c.tam);
      c.pintado.fill(-1);
      ctx!.fillStyle = papel;
      ctx!.fillRect(0, 0, rect.width, rect.height);
      arrancar();
    }
    const quitarTema = alCambiarTema(() => requestAnimationFrame(recolorear));

    let temporizador = 0;
    let tamano = "";
    const observador = new ResizeObserver(([entrada]) => {
      const nuevo = `${Math.round(entrada.contentRect.width)}x${Math.round(entrada.contentRect.height)}`;
      if (nuevo === tamano) return;
      tamano = nuevo;
      window.clearTimeout(temporizador);
      temporizador = window.setTimeout(preparar, 120);
    });

    async function iniciar() {
      await document.fonts.ready;
      if (fuente) {
        imagen = await new Promise<HTMLImageElement | null>((resolver) => {
          const img = new Image();
          img.onload = () => resolver(img);
          img.onerror = () => resolver(null);
          img.src = fuente;
        });
      }
      if (cancelado) return;
      const r = canvas!.getBoundingClientRect();
      tamano = `${Math.round(r.width)}x${Math.round(r.height)}`;
      preparar();
      observador.observe(canvas!);
      window.addEventListener("pointermove", alMover, { passive: true });
      window.addEventListener("pointerdown", alMover, { passive: true });
    }
    iniciar();
    const quitarRelleno = relleno?.on("change", (v) => {
      rellenoActual = v;
      arrancar();
    });

    return () => {
      quitarRelleno?.();
      quitarTema();
      cancelado = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(respaldo);
      window.clearTimeout(temporizador);
      observador.disconnect();
      window.removeEventListener("pointermove", alMover);
      window.removeEventListener("pointerdown", alMover);
    };
  }, [fuente, relleno]);

  return <canvas ref={lienzo} aria-hidden="true" className={className} />;
}
