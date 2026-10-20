"use client";

import { useState } from "react";
import type { Video } from "@/lib/data";

const RAMPA = " .·:;-=+*#%@";
// La portada mide 9:16; con celdas de Space Mono, 24 columnas por 22 filas la llenan.
const COLUMNAS = 24;
const FILAS = 22;

// Ruido de 0 a 1 por celda (finalizador de murmur3): reparte el grano sin diagonales.
function ruido(n: number) {
  n = Math.imul(n ^ (n >>> 16), 0x85ebca6b);
  n = Math.imul(n ^ (n >>> 13), 0xc2b2ae35);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

// Un botón de reproducir dibujado con caracteres, como el campo de la portada:
// denso dentro del triángulo, un halo medio alrededor y grano suelto, distinto
// para cada vídeo.
function texturaPlay(semilla: string) {
  let h = 0;
  for (const c of semilla) h = Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0;
  const lineas: string[] = [];
  for (let f = 0; f < FILAS; f++) {
    let linea = "";
    for (let c = 0; c < COLUMNAS; c++) {
      const x = (c + 0.5) / COLUMNAS;
      const y = (f + 0.5) / FILAS;
      // Triángulo que apunta a la derecha, centrado y con proporciones de icono.
      const avance = (x - 0.34) / 0.44;
      const mitad = 0.15 * (1 - avance);
      const distancia = Math.abs(y - 0.5);
      const dentro = avance >= 0 && avance <= 1 && distancia <= mitad;
      const halo = !dentro && avance >= -0.1 && avance <= 1.12 && distancia <= mitad + 0.045;
      const r = ruido((f * COLUMNAS + c) ^ h);
      const densidad = dentro ? 0.75 + 0.25 * r : halo ? 0.25 + 0.2 * r : r < 0.09 ? 0.08 + r : 0;
      linea += RAMPA[Math.round(densidad * (RAMPA.length - 1))];
    }
    lineas.push(linea);
  }
  return lineas.join("\n");
}

// Vídeo de TikTok que no carga nada de TikTok hasta que se pulsa: así la web
// sigue ligera y TikTok no pone cookies a quien solo está leyendo.
export function VideoTikTok({ video }: { video: Video }) {
  const [cargado, setCargado] = useState(false);

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
          >
            <pre
              aria-hidden="true"
              className="absolute inset-0 m-0 font-mono text-[6.8cqw] leading-[1.188] text-cobalto opacity-75 transition-[opacity,transform] duration-300 ease-out group-hover:scale-[1.03] group-hover:opacity-100 group-active:scale-[0.99]"
            >
              {texturaPlay(video.id)}
            </pre>
          </button>
        )}
      </div>
      <figcaption className="mt-3">
        <span className="block font-serif text-[clamp(1.3rem,2vw,1.7rem)] leading-tight">{video.titulo}</span>
        <span className="text-[13px] text-tinta-suave">{video.vistas} reproducciones</span>
      </figcaption>
    </figure>
  );
}
