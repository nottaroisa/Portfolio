"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const RUIDO = "{}[]<>/;=+*01#&$%";

type Props = {
  texto: string;
  className?: string;
  /** Además de al pasar el ratón: al aparecer ("montar") o al entrar en pantalla ("ver"). */
  lanzarAl?: "montar" | "ver";
  /** Solo baraja los dígitos: las cifras se "calculan" sin mover el resto de la frase. */
  soloCifras?: boolean;
  duracion?: number;
};

// Texto que se "descifra": al pasar el ratón (o al enfocarlo con el teclado)
// las letras pasan por caracteres de código hasta quedarse quietas.
// Adaptado del efecto text-randomized de ui-layouts.
export function Descifrar({ texto, className, lanzarAl, soloCifras = false, duracion = 380 }: Props) {
  const [mostrado, setMostrado] = useState(texto);
  const raf = useRef(0);
  const caja = useRef<HTMLSpanElement>(null);

  const lanzar = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const inicio = performance.now();
    const paso = (t: number) => {
      const avance = Math.min(1, (t - inicio) / duracion);
      const fijas = Math.floor(avance * texto.length);
      const azar = (i: number) => i * 7 + Math.floor(t / 40);
      setMostrado(
        texto
          .split("")
          .map((c, i) => {
            if (i < fijas) return c;
            if (soloCifras) return /\d/.test(c) ? String(azar(i) % 10) : c;
            return c === " " ? c : RUIDO[azar(i) % RUIDO.length];
          })
          .join(""),
      );
      if (avance < 1) raf.current = requestAnimationFrame(paso);
    };
    raf.current = requestAnimationFrame(paso);
  }, [texto, soloCifras, duracion]);

  useEffect(() => {
    if (lanzarAl === "montar") lanzar();
    if (lanzarAl !== "ver" || !caja.current) return;
    // Una sola vez, cuando se ve casi entero.
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        lanzar();
        observador.disconnect();
      },
      { threshold: 0.6 },
    );
    observador.observe(caja.current);
    return () => observador.disconnect();
  }, [lanzarAl, lanzar]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span ref={caja} className={className} onPointerEnter={lanzar} onFocus={lanzar}>
      {/* El lector de pantalla lee siempre el texto real. */}
      <span aria-hidden="true">{mostrado}</span>
      <span className="sr-only">{texto}</span>
    </span>
  );
}
