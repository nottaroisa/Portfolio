"use client";

import { AnimatePresence, m, useReducedMotion, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { proyectos } from "@/lib/data";
import { Cifras } from "./Cifras";
import { PreviaProyecto } from "./PreviaProyecto";

const muelle = { stiffness: 160, damping: 18, mass: 0.2 };

// Lista de proyectos con la vista previa que sigue al ratón (adaptado de
// image-reveal de ui-layouts). En pantallas táctiles la vista previa va debajo
// de cada nombre, porque no hay ratón que seguir.
export function ListaProyectos() {
  const caja = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState<string | null>(null);
  const reducido = useReducedMotion();
  const x = useSpring(0, muelle);
  const y = useSpring(0, muelle);

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !caja.current) return;
    const r = caja.current.getBoundingClientRect();
    x.set(e.clientX - r.left + 24);
    y.set(e.clientY - r.top - 120);
  };

  const proyectoActivo = proyectos.find((p) => p.id === activo);

  return (
    <div ref={caja} className="relative" onPointerMove={mover} onPointerLeave={() => setActivo(null)}>
      <ul>
        {proyectos.map((p) => (
          <li key={p.id} className="border-t border-linea last:border-b">
            <Link
              href={`/proyectos/${p.id}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActivo(p.id)}
              onFocus={() => setActivo(p.id)}
              onBlur={() => setActivo(null)}
              className="group grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-baseline md:py-8"
            >
              <span className="font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.95] transition-colors group-hover:text-cobalto">
                <Cifras>{p.nombre}</Cifras>
              </span>
              <span className="text-[13px] leading-relaxed text-tinta-suave">
                <span className="block text-tinta">
                  {p.tipo}
                  {p.estado ? ` (${p.estado.toLowerCase()})` : ""}
                </span>
                {p.stack.join(", ")}
              </span>
              {/* Vista previa en línea para pantallas sin ratón. */}
              <span className="block md:hidden">
                <PreviaProyecto proyecto={p} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Vista previa flotante, solo con ratón. Decorativa: el enlace ya tiene el nombre. */}
      <AnimatePresence>
        {proyectoActivo && (
          <m.div
            key={proyectoActivo.id}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 hidden w-[300px] md:block"
            style={{ x, y }}
            initial={{ opacity: 0, clipPath: reducido ? "inset(0)" : "inset(50% 0 50% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0% 0)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <PreviaProyecto proyecto={proyectoActivo} />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
