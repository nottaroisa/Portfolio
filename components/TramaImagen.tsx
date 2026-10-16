"use client";

import { useEffect, useRef } from "react";
import { alCambiarTema, temaActual } from "@/lib/tema";

// Matriz de Bayer 4×4 para el tramado ordenado.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

// Imagen impresa a dos tintas (tramado de puntos). Al pasar el ratón o al
// enfocar el enlace que la contiene, aparece la foto original a color.
export function TramaImagen({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    let datos: Uint8ClampedArray | null = null;
    let w = 0;
    let h = 0;

    function tramar() {
      if (!datos || !canvas) return;
      const css = getComputedStyle(document.documentElement);
      const papel = css.getPropertyValue("--papel").trim() || "#f4f4f0";
      const cobalto = css.getPropertyValue("--cobalto").trim() || "#1d2cf3";
      // En claro, la tinta marca las sombras; en la cianotipia (oscuro), la
      // tinta es clara y marca las luces, así la foto se sigue leyendo en positivo.
      const oscuro = temaActual() === "oscuro";
      const c = canvas.getContext("2d")!;
      c.fillStyle = papel;
      c.fillRect(0, 0, w, h);
      c.fillStyle = cobalto;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const lum = (0.2126 * datos[i] + 0.7152 * datos[i + 1] + 0.0722 * datos[i + 2]) / 255;
          const umbral = BAYER[(y % 4) * 4 + (x % 4)];
          if (oscuro ? lum > umbral : lum < umbral) c.fillRect(x, y, 1, 1);
        }
      }
    }

    const img = new Image();
    img.onload = () => {
      const punto = 3; // tamaño del punto de trama en píxeles de CSS
      w = Math.round(canvas.clientWidth / punto) || 160;
      h = Math.round((w * img.naturalHeight) / img.naturalWidth);
      const o = document.createElement("canvas");
      o.width = w;
      o.height = h;
      const oc = o.getContext("2d", { willReadFrequently: true })!;
      oc.drawImage(img, 0, 0, w, h);
      datos = oc.getImageData(0, 0, w, h).data;
      canvas.width = w;
      canvas.height = h;
      tramar();
    };
    img.src = src;

    return alCambiarTema(() => requestAnimationFrame(tramar));
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <canvas ref={lienzo} aria-hidden="true" className="block h-full w-full object-cover [image-rendering:pixelated]" />
      {/* eslint-disable-next-line @next/next/no-img-element -- web estática sin optimizador de imágenes */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </div>
  );
}
