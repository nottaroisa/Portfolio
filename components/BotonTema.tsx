"use client";

import { useSyncExternalStore } from "react";
import { alCambiarTema, fijarTema, temaActual } from "@/lib/tema";

// Botón fijo arriba a la derecha para cambiar entre la impresión (claro) y la
// cianotipia (oscuro). Está en todas las páginas y acompaña al scroll.
export function BotonTema() {
  const tema = useSyncExternalStore(alCambiarTema, temaActual, () => null);
  const oscuro = tema === "oscuro";
  const accion = oscuro ? "Modo claro" : "Modo oscuro";

  return (
    <button
      type="button"
      data-boton-tema
      onClick={() => fijarTema(oscuro ? "claro" : "oscuro")}
      aria-label={`Cambiar a ${accion.toLowerCase()}`}
      title={`Cambiar a ${accion.toLowerCase()}`}
      // Hasta saber el tema (antes de hidratar) se reserva el sitio sin mostrarlo.
      className={`fixed right-4 top-4 z-40 flex h-10 items-center gap-2 rounded-full border-2 border-tinta bg-papel px-2.5 text-[13px] text-tinta transition-colors hover:border-cobalto hover:text-cobalto sm:right-6 sm:top-6 md:right-8 md:top-7 ${
        tema === null ? "invisible" : ""
      }`}
    >
      {/* Círculo mitad tinta, mitad papel: gira media vuelta al cambiar de tema. */}
      <svg
        viewBox="0 0 20 20"
        className={`h-5 w-5 shrink-0 transition-transform duration-500 ${oscuro ? "rotate-180" : ""}`}
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 1.75a8.25 8.25 0 0 0 0 16.5Z" fill="currentColor" />
      </svg>
      <span className="hidden pr-1 md:inline" aria-hidden="true">
        {accion}
      </span>
    </button>
  );
}
