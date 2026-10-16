"use client";

import { useEffect, useRef, useState } from "react";

const RUIDO = "{}[]<>/;=+*01#&$%";

// Texto que se "descifra": al pasar el ratón (o al enfocarlo con el teclado)
// las letras pasan por caracteres de código hasta quedarse quietas.
// Adaptado del efecto text-randomized de ui-layouts.
export function Descifrar({ texto, className }: { texto: string; className?: string }) {
  const [mostrado, setMostrado] = useState(texto);
  const raf = useRef(0);

  const lanzar = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const inicio = performance.now();
    const duracion = 380;
    const paso = (t: number) => {
      const avance = Math.min(1, (t - inicio) / duracion);
      const fijas = Math.floor(avance * texto.length);
      setMostrado(
        texto
          .split("")
          .map((c, i) => (i < fijas || c === " " ? c : RUIDO[(i * 7 + Math.floor(t / 40)) % RUIDO.length]))
          .join(""),
      );
      if (avance < 1) raf.current = requestAnimationFrame(paso);
    };
    raf.current = requestAnimationFrame(paso);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span className={className} onPointerEnter={lanzar} onFocus={lanzar}>
      {/* El lector de pantalla lee siempre el texto real. */}
      <span aria-hidden="true">{mostrado}</span>
      <span className="sr-only">{texto}</span>
    </span>
  );
}
