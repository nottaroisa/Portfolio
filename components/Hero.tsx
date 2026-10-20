"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { enlaces, perfil } from "@/lib/data";
import { CampoAscii } from "./ascii/CampoAscii";
import { Descifrar } from "./Descifrar";

// Hero con máscara de texto (adaptado de text-overlay-video-masking de
// ui-layouts): al principio el ASCII ocupa toda la pantalla; al hacer scroll,
// el papel lo va cubriendo y el campo de caracteres queda vivo solo dentro de
// las letras del nombre.
export function Hero() {
  const seccion = useRef<HTMLElement>(null);
  const reducido = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: seccion, offset: ["start start", "end end"] });
  const cubrir = useTransform(scrollYProgress, [0.08, 0.5], [0, 1]);
  const escala = useTransform(scrollYProgress, [0.08, 0.7], [1.5, 1]);
  const pista = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={seccion} className="relative h-[240svh]" aria-label="Portada">
      <div className="sticky top-0 h-svh overflow-hidden">
        <CampoAscii className="absolute inset-0 h-full w-full" relleno={cubrir} />

        {/* Papel con el nombre recortado: dos composiciones, apaisada y vertical. */}
        <m.svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          viewBox="0 0 1000 560"
          preserveAspectRatio="xMidYMid meet"
          style={{ opacity: cubrir }}
        >
          <defs>
            <mask id="nombre-apaisado" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000">
              <rect x="-2000" y="-2000" width="5000" height="5000" fill="white" />
              <m.g style={{ scale: reducido ? 1 : escala, originX: "500px", originY: "280px" }}>
                <text x="40" y="260" fill="black" stroke="black" strokeWidth="9" strokeLinejoin="round" fontSize="250" style={{ fontFamily: "var(--font-instrument)" }} letterSpacing="-6">
                  Isabella
                </text>
                <text x="40" y="470" fill="black" stroke="black" strokeWidth="7" strokeLinejoin="round" fontSize="168" style={{ fontFamily: "var(--font-instrument)" }} letterSpacing="-4">
                  Nottaro Sánchez
                </text>
              </m.g>
            </mask>
          </defs>
          <rect x="-2000" y="-2000" width="5000" height="5000" style={{ fill: "var(--papel)" }} mask="url(#nombre-apaisado)" />
        </m.svg>
        <m.svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full md:hidden"
          viewBox="0 0 400 760"
          preserveAspectRatio="xMidYMid meet"
          style={{ opacity: cubrir }}
        >
          <defs>
            <mask id="nombre-vertical" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000">
              <rect x="-2000" y="-2000" width="5000" height="5000" fill="white" />
              <m.g style={{ scale: reducido ? 1 : escala, originX: "200px", originY: "380px" }}>
                {/* Letras grandes y un trazo fino que engorda los palos sin cerrar los huecos
                    de la a, la b o la e: con caracteres de 9 px, el nombre se sigue leyendo. */}
                <text x="8" y="290" fill="black" stroke="black" strokeWidth="6" strokeLinejoin="round" fontSize="140" style={{ fontFamily: "var(--font-instrument)" }} letterSpacing="-2">
                  Isabella
                </text>
                <text x="8" y="420" fill="black" stroke="black" strokeWidth="6" strokeLinejoin="round" fontSize="140" style={{ fontFamily: "var(--font-instrument)" }} letterSpacing="-2">
                  Nottaro
                </text>
                <text x="8" y="550" fill="black" stroke="black" strokeWidth="6" strokeLinejoin="round" fontSize="140" style={{ fontFamily: "var(--font-instrument)" }} letterSpacing="-2">
                  Sánchez
                </text>
              </m.g>
            </mask>
          </defs>
          <rect x="-2000" y="-2000" width="5000" height="5000" style={{ fill: "var(--papel)" }} mask="url(#nombre-vertical)" />
        </m.svg>

        {/* Cabecera: nombre, enlaces y CV, visibles desde el primer momento. */}
        <header className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-start justify-between gap-4 p-4 pr-16 sm:p-6 sm:pr-20 md:p-8 md:pr-48">
          <h1 className="bg-papel px-2 py-1 font-serif text-[26px] leading-none md:text-[32px]">{perfil.nombre}</h1>
          <nav aria-label="Enlaces" className="flex flex-wrap items-center gap-x-1 gap-y-2 text-[13px]">
            <a href={enlaces.linkedin} target="_blank" rel="noopener noreferrer" className="bg-papel px-2 py-1 hover:text-cobalto">
              <Descifrar texto="LinkedIn" />
            </a>
            <a href={enlaces.github} target="_blank" rel="noopener noreferrer" className="bg-papel px-2 py-1 hover:text-cobalto">
              <Descifrar texto="GitHub" />
            </a>
            <a href={`mailto:${enlaces.correo}`} className="bg-papel px-2 py-1 hover:text-cobalto">
              <Descifrar texto="Correo" />
            </a>
            <a href={enlaces.cv} download className="bg-cobalto px-3 py-1 font-bold text-papel hover:bg-cobalto-hondo">
              <Descifrar texto="Descargar CV" />
            </a>
          </nav>
        </header>

        {/* Pie de la portada: qué hacer y qué soy, en una línea. */}
        <m.div
          style={{ opacity: pista }}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-3 p-4 text-[13px] sm:p-6 md:p-8"
        >
          <p className="max-w-[38ch] bg-papel px-2 py-1 leading-relaxed">
            Estudio 2º de Desarrollo de Aplicaciones Multiplataforma. {perfil.lema}
          </p>
          <p className="bg-papel px-2 py-1 text-tinta-suave">
            {/* Según haya ratón o no, no según el ancho: una tablet también es táctil. */}
            <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">Mueve el ratón: el ASCII te sigue. </span>
            <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">Toca la pantalla: el ASCII responde. </span>
            Baja para ver mi nombre.
          </p>
        </m.div>
      </div>
    </section>
  );
}
