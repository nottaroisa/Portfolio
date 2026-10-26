"use client";

import { useEffect, useRef } from "react";

// Ritmo del dibujo: unos 20 fotogramas por segundo bastan con caracteres.
const INTERVALO = 50;
// Una vuelta cada 14 segundos, que se acelera mientras el ratón está encima.
const VUELTA = 14_000;

// Un modelo 3D de threejsassets que gira dibujado con caracteres. No carga nada
// (ni three.js ni el modelo) hasta que se acerca a la vista, y deja de dibujar
// en cuanto sale. Con movimiento reducido se dibuja una vez, quieto.
// `modelo` es el nombre del fichero en /modelos, o varios separados por espacios
// (el primero detrás, el resto delante).
export function Modelo3DAscii({ modelo, columnas = 46, filas = 22, className }: { modelo: string; columnas?: number; filas?: number; className?: string }) {
  const pre = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const elemento = pre.current;
    if (!elemento) return;
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

    const pintar = () => {
      if (escena) elemento.textContent = escena.dibujar(giro, inclinacion);
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
          .then((m) => m.crearEscena(modelo.split(" "), columnas, filas))
          .then((e) => {
            if (!vivo) return e.liberar();
            escena = e;
            pintar();
            if (visible) arrancar();
          })
          .catch(() => {
            // Sin WebGL (o sin red) el hueco se queda vacío: es decorativo.
          });
      },
      { rootMargin: "200px" },
    );
    observador.observe(elemento);

    // Con el ratón encima gira más deprisa y se inclina hacia el cursor.
    const caja = elemento.parentElement!;
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reducido) return;
      const r = caja.getBoundingClientRect();
      velocidad = 3;
      inclinacion = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    };
    const salir = () => {
      velocidad = 1;
      inclinacion = 0;
    };
    caja.addEventListener("pointermove", mover);
    caja.addEventListener("pointerleave", salir);

    return () => {
      vivo = false;
      parar();
      observador.disconnect();
      caja.removeEventListener("pointermove", mover);
      caja.removeEventListener("pointerleave", salir);
      escena?.liberar();
    };
  }, [modelo, columnas, filas]);

  return (
    <figure aria-hidden="true" className={`m-0 select-none ${className ?? ""}`}>
      <pre
        ref={pre}
        data-modelo={modelo}
        className="m-0 font-mono leading-none text-cobalto"
        // Hueco reservado desde el principio: el dibujo no mueve nada al llegar.
        style={{ fontSize: "clamp(5px, 0.68vw, 9px)", width: `${columnas * 0.612}em`, height: `${filas}em` }}
      />
    </figure>
  );
}
