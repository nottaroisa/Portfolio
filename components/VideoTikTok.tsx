"use client";

import { useEffect, useRef, useState } from "react";
import { urlDeVideo, type Video } from "@/lib/data";

const RAMPA = " .·:;-=+*#%@";
const CODIGO = "{}[]<>/;=+*01#&$%";
// La portada mide 9:16; con celdas de Space Mono, 32 columnas por 29 filas la llenan.
const COLUMNAS = 32;
const FILAS = 29;
// Tamaño de letra e interlineado para que la rejilla ocupe justo la portada, en
// unidades del contenedor (cqw): cada carácter de Space Mono avanza 0,612 em.
const AVANCE_SPACE_MONO = 0.612;
const LETRA_CQW = 100 / COLUMNAS / AVANCE_SPACE_MONO;
const RENGLON = (100 * 16) / 9 / FILAS / LETRA_CQW;
// El dibujo, en unidades de la portada (9 de ancho por 16 de alto): un anillo y,
// dentro, el triángulo de reproducir, desplazado un poco a la derecha para que
// se vea centrado (el peso de un triángulo está en su base).
const CENTRO_X = 4.5;
const CENTRO_Y = 8;
const RADIO = 3.6;
const GROSOR = 0.28;
const TRIANGULO_X0 = CENTRO_X - 1.2 + 0.2;
const TRIANGULO_X1 = CENTRO_X + 2.4 + 0.2;
const TRIANGULO_MITAD = 2.1;
const MUESTRAS = 4;

// Ruido de 0 a 1 por celda (finalizador de murmur3): reparte el grano sin diagonales.
function ruido(n: number) {
  n = Math.imul(n ^ (n >>> 16), 0x85ebca6b);
  n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

// Qué parte de una celda cae dentro del triángulo y del anillo, de 0 a 1:
// se mide con 4×4 puntos por celda, así los bordes salen suaves (como un
// antialiasing hecho con caracteres).
function cobertura(c: number, f: number) {
  let triangulo = 0;
  let anillo = 0;
  for (let i = 0; i < MUESTRAS; i++) {
    for (let j = 0; j < MUESTRAS; j++) {
      const x = ((c + (i + 0.5) / MUESTRAS) / COLUMNAS) * 9;
      const y = ((f + (j + 0.5) / MUESTRAS) / FILAS) * 16;
      const avance = (x - TRIANGULO_X0) / (TRIANGULO_X1 - TRIANGULO_X0);
      if (avance >= 0 && avance <= 1 && Math.abs(y - CENTRO_Y) <= TRIANGULO_MITAD * (1 - avance)) triangulo++;
      if (Math.abs(Math.hypot(x - CENTRO_X, y - CENTRO_Y) - RADIO) <= GROSOR) anillo++;
    }
  }
  const total = MUESTRAS * MUESTRAS;
  return { triangulo: triangulo / total, anillo: anillo / total };
}

// La forma no cambia entre vídeos ni entre fotogramas: se calcula una vez.
const FORMA = Array.from({ length: FILAS * COLUMNAS }, (_, i) => cobertura(i % COLUMNAS, Math.floor(i / COLUMNAS)));

// El botón de reproducir dibujado con caracteres. Con `paso` > 0 (ratón encima)
// el anillo se vuelve código que cambia en cada paso, como el campo de la portada.
function texturaPlay(semilla: string, paso: number) {
  let h = 0;
  for (const c of semilla) h = Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0;
  const lineas: string[] = [];
  for (let f = 0; f < FILAS; f++) {
    let linea = "";
    for (let c = 0; c < COLUMNAS; c++) {
      const i = f * COLUMNAS + c;
      const { triangulo, anillo } = FORMA[i];
      const r = ruido(i ^ h);
      if (paso > 0 && anillo > 0.2) {
        linea += CODIGO[Math.floor(ruido(i ^ h ^ (paso * 2654435761)) * CODIGO.length)];
        continue;
      }
      const forma = Math.max(triangulo, anillo * 0.8);
      const densidad = forma > 0 ? 0.3 + 0.7 * forma : r < 0.06 ? 0.1 + r : 0;
      linea += RAMPA[Math.round(densidad * (RAMPA.length - 1))];
    }
    lineas.push(linea);
  }
  return lineas.join("\n");
}

// Mientras el ratón está encima, el anillo cambia unas 11 veces por segundo.
function usePasoAlPasar() {
  const [paso, setPaso] = useState(0);
  const temporizador = useRef(0);
  const parar = () => {
    window.clearInterval(temporizador.current);
    setPaso(0);
  };
  const empezar = (e: { pointerType: string }) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.clearInterval(temporizador.current);
    temporizador.current = window.setInterval(() => setPaso((p) => p + 1), 90);
  };
  useEffect(() => () => window.clearInterval(temporizador.current), []);
  return { paso, alEntrar: empezar, alSalir: parar };
}

// Vídeo de TikTok que no carga nada de TikTok hasta que se pulsa: así la web
// sigue ligera y TikTok no pone cookies a quien solo está leyendo.
export function VideoTikTok({ video }: { video: Video }) {
  const [cargado, setCargado] = useState(false);
  const { paso, alEntrar, alSalir } = usePasoAlPasar();

  return (
    <figure className="min-w-0">
      <div className="aspect-[9/16] w-full bg-papel-hondo">
        {cargado ? (
          <iframe
            src={`https://www.tiktok.com/player/v1/${video.id}?autoplay=1&rel=0`}
            title={`Vídeo de TikTok: ${video.titulo}`}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            className="h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setCargado(true)}
            aria-label={`Reproducir: ${video.titulo}`}
            className="group @container relative block h-full w-full overflow-hidden text-left"
            onPointerEnter={alEntrar}
            onPointerLeave={alSalir}
          >
            <pre
              aria-hidden="true"
              className="absolute inset-0 m-0 font-mono text-cobalto opacity-90 transition-[opacity,transform] duration-300 ease-out group-hover:opacity-100 group-active:scale-[0.98]"
              style={{ fontSize: `${LETRA_CQW}cqw`, lineHeight: RENGLON }}
            >
              {texturaPlay(video.id, paso)}
            </pre>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex items-start gap-3">
        {/* Miniatura de la portada junto a la descripción. Se sirve desde la web (las de TikTok caducan). */}
        {/* eslint-disable-next-line @next/next/no-img-element -- web estática sin optimizador de imágenes */}
        <img
          src={`/contenido/${video.id}.jpg`}
          alt=""
          width={540}
          height={960}
          loading="lazy"
          decoding="async"
          className="aspect-[9/16] w-12 shrink-0 border-2 border-cobalto object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block font-serif text-[clamp(1.3rem,2vw,1.7rem)] leading-tight">{video.titulo}</span>
          <span className="flex flex-wrap items-baseline justify-between gap-x-3 text-[13px] text-tinta-suave">
            {video.vistas} reproducciones
            <a href={urlDeVideo(video)} target="_blank" rel="noopener noreferrer" className="inline-block py-1 text-cobalto hover:underline">
              Ver en TikTok<span aria-hidden="true"> ↗</span>
            </a>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
