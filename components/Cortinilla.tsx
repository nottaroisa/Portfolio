"use client";

import { m, useReducedMotion } from "framer-motion";

// Transición de entrada de las páginas de proyecto: una plancha de cobalto
// que se retira hacia arriba, como una hoja que sale de la impresora. La
// plancha es la misma tinta en los dos temas: en la cianotipia, el cobalto del
// tema es un lavanda claro que destellaba a pantalla completa.
export function Cortinilla() {
  const reducido = useReducedMotion();
  if (reducido) return null;
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 bg-plancha"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
    />
  );
}
