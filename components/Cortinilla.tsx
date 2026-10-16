"use client";

import { m, useReducedMotion } from "framer-motion";

// Transición de entrada de las páginas de proyecto: una plancha de cobalto
// que se retira hacia arriba, como una hoja que sale de la impresora.
export function Cortinilla() {
  const reducido = useReducedMotion();
  if (reducido) return null;
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 bg-cobalto"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
    />
  );
}
