"use client";

import { useEffect, useRef } from "react";
import { alCambiarTema } from "@/lib/tema";

// Ritmo del dibujo: 30 fotogramas por segundo bastan para un giro lento.
const INTERVALO = 33;
// Una vuelta cada 14 segundos, que se acelera mientras el ratón está encima.
const VUELTA = 14_000;

// Un modelo 3D de threejsassets que gira teñido con la tinta azul del tema. No
// carga nada (ni three.js ni el modelo) hasta que se acerca a la vista, y deja
// de dibujar en cuanto sale. Con movimiento reducido se dibuja una vez, quieto.
// `modelo` es el nombre del fichero en /modelos, o varios separados por espacios
// (el primero detrás, el resto delante).
export function Modelo3D({ modelo, className }: { modelo: string; className?: string }) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let escena: Awaited<ReturnType<typeof import("./motor3d").crearEscena>> | null = null;
    let cargando = false;
    let visible = false;
    let temporizador = 0;
    let giro = 0.6;
    let velocidad = 1;
    let inclinacion = 0;
    let anterior = 0;
    let vivo = true;

    // El canvas a la resolución de la pantalla, para que el borde salga nítido.
    const ajustar = () => {
      const r = canvas.getBoundingClientRect();
      const densidad = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * densidad));
      canvas.height = Math.max(1, Math.round(r.height * densidad));
    };
    // La tinta se lee del CSS en cada dibujo: así sigue al tema.
    const pintar = () => {
      if (escena) escena.dibujar(canvas, giro, inclinacion, getComputedStyle(canvas).color);
    };
    const paso = () => {
      const ahora = performance.now();
      giro += ((ahora - anterior) / VUELTA) * Math.PI * 2 * velocidad;
      anterior = ahora;
      pintar();
    };
    const arrancar = () => {
      if (!escena || reducido || temporizador) return;
      anterior = performance.now();
      temporizador = window.setInterval(paso, INTERVALO);
    };
    const parar = () => {
      window.clearInterval(temporizador);
      temporizador = 0;
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.isIntersecting;
        if (!visible) return parar();
        if (escena) return arrancar();
        if (cargando) return;
        cargando = true;
        import("./motor3d")
          .then((m) => m.crearEscena(modelo.split(" ")))
          .then((e) => {
            if (!vivo) return e.liberar();
            escena = e;
            ajustar();
            pintar();
            if (visible) arrancar();
          })
          .catch(() => {
            // Sin WebGL (o sin red) el hueco se queda vacío: es decorativo.
          });
      },
      { rootMargin: "200px" },
    );
    observador.observe(canvas);

    // Al cambiar de tema se repinta con la tinta nueva (también si está quieto).
    const dejarTema = alCambiarTema(() => requestAnimationFrame(pintar));

    // Con el ratón encima gira más deprisa y se inclina hacia el cursor.
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reducido) return;
      const r = canvas.getBoundingClientRect();
      velocidad = 3;
      inclinacion = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    };
    const salir = () => {
      velocidad = 1;
      inclinacion = 0;
    };
    canvas.addEventListener("pointermove", mover);
    canvas.addEventListener("pointerleave", salir);

    return () => {
      vivo = false;
      parar();
      observador.disconnect();
      dejarTema();
      canvas.removeEventListener("pointermove", mover);
      canvas.removeEventListener("pointerleave", salir);
      escena?.liberar();
    };
  }, [modelo]);

  return (
    <figure aria-hidden="true" className={`m-0 select-none ${className ?? ""}`}>
      {/* Hueco reservado desde el principio: el modelo no mueve nada al llegar. */}
      <canvas ref={lienzo} data-modelo={modelo} className="block h-[clamp(7rem,11vw,10rem)] w-[clamp(9rem,15vw,13.5rem)] text-cobalto" />
    </figure>
  );
}
