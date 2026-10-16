"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const cargar = () => import("@/lib/animaciones").then((m) => m.default);

// framer-motion en modo ligero: los componentes `m.*` se pintan al momento y
// las funciones de animación llegan después, sin bloquear la primera carga.
// reducedMotion="user": si el sistema pide menos movimiento, solo hay fundidos.
export function Movimiento({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={cargar} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
