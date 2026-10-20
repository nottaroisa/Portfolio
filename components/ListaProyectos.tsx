"use client";

import { AnimatePresence, m, useReducedMotion, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { proyectos } from "@/lib/data";
import { Cifras } from "./Cifras";
import { PreviaProyecto } from "./PreviaProyecto";

const muelle = { stiffness: 160, damping: 18, mass: 0.2 };

// Lista de proyectos con la vista previa que sigue al ratón (adaptado de
// image-reveal de ui-layouts). Sin ratón (móviles y tablets) la vista previa va
// debajo de cada nombre, porque no hay puntero que seguir: se decide por la
// capacidad del dispositivo, no por el ancho de pantalla.
export function ListaProyectos() {
  const caja = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState<string | null>(null);
  const reducido = useReducedMotion();
  const x = useSpring(0, muelle);
  const y = useSpring(0, muelle);

  // La primera vez la previa salta a su sitio; después llega con el muelle.
  const colocar = (valor: typeof x, destino: number) => (activo ? valor.set(destino) : valor.jump(destino));

  // La previa queda justo encima de la fila del proyecto, para no taparlo.
  // Con ratón, en horizontal sigue al cursor; con teclado, se ancla al título.
  const anclar = (fila: HTMLElement, cursorX?: number) => {
    if (!caja.current) return;
    const r = caja.current.getBoundingClientRect();
    const f = fila.getBoundingClientRect();
    colocar(y, f.top - r.top - 12);
    colocar(x, cursorX === undefined ? f.left - r.left : cursorX - r.left + 24);
  };

  const mover = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !caja.current) return;
    x.set(e.clientX - caja.current.getBoundingClientRect().left + 24);
  };

  const proyectoActivo = proyectos.find((p) => p.id === activo);

  return (
    <div ref={caja} className="relative" onPointerMove={mover} onPointerLeave={() => setActivo(null)}>
      <ul>
        {proyectos.map((p) => (
          <li key={p.id} className="border-t border-linea last:border-b">
            <Link
              href={`/proyectos/${p.id}`}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                anclar(e.currentTarget, e.clientX);
                setActivo(p.id);
              }}
              onFocus={(e) => {
                anclar(e.currentTarget);
                setActivo(p.id);
              }}
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
              {/* Vista previa en línea para pantallas sin ratón, bajo la ficha. */}
              <span className="block md:col-start-2 [@media(hover:hover)_and_(pointer:fine)]:hidden">
                <PreviaProyecto proyecto={p} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Vista previa flotante, en dispositivos con ratón (también al moverse con el teclado).
          Decorativa: el enlace ya tiene el nombre.
          Un solo contenedor: se anima al aparecer y, al pasar de un proyecto a otro,
          cambia de contenido al instante (dos previas a la vez se pisarían). */}
      <AnimatePresence>
        {proyectoActivo && (
          <m.div
            key="previa"
            aria-hidden="true"
            // El punto de anclaje es el borde de abajo (-translate-y-full usa la propiedad
            // `translate`, que se suma al transform de framer-motion sin pisarlo).
            className="pointer-events-none absolute left-0 top-0 z-20 hidden w-[300px] -translate-y-full [@media(hover:hover)_and_(pointer:fine)]:block"
            style={{ x, y }}
            initial={{ opacity: 0, clipPath: reducido ? "inset(0)" : "inset(50% 0 50% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0% 0)", transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeOut" } }}
          >
            <PreviaProyecto proyecto={proyectoActivo} />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
