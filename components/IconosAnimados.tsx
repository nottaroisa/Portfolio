"use client";

import { m, useAnimation, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

// Iconos animados de animateicons (https://github.com/Avijit07x/animateicons,
// licencia MIT; formas de Lucide, licencia ISC), adaptados a la web: usan el
// LazyMotion de <Movimiento> en vez del suyo y se animan cuando lo pide el
// botón que los lleva, no solo al pasar por encima del propio icono.

// Cada vez que el botón cambia `vez`, el icono repite su animación. Con
// movimiento reducido se queda quieto.
function useAnimar(vez: number) {
  const controles = useAnimation();
  const reducido = useReducedMotion();
  useEffect(() => {
    if (vez > 0 && !reducido) controles.start("animar");
  }, [vez, reducido, controles]);
  return controles;
}

// Para el botón: cuenta las veces que se le pasa el ratón o se enfoca.
export function useVezAlPasar() {
  const [vez, setVez] = useState(0);
  const otra = () => setVez((v) => v + 1);
  return {
    vez,
    alPasar: {
      onPointerEnter: (e: { pointerType: string }) => e.pointerType === "mouse" && otra(),
      onFocus: otra,
    },
  };
}

function Svg({ controles, className, children }: { controles: ReturnType<typeof useAnimation>; className?: string; children: React.ReactNode }) {
  return (
    <m.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className ?? "h-[1.15em] w-[1.15em]"}`}
      animate={controles}
      initial="quieto"
    >
      {children}
    </m.svg>
  );
}

// Sobre: la solapa se abre y se cierra.
const solapa: Variants = {
  quieto: { scaleY: 1 },
  animar: { scaleY: [1, -0.8, -0.8, 1], transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.4, 0.65, 1] } },
};

export function IconoCorreo({ vez, className }: { vez: number; className?: string }) {
  const controles = useAnimar(vez);
  return (
    <Svg controles={controles} className={className}>
      <m.path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" variants={solapa} style={{ transformBox: "view-box", originX: "12px", originY: "7px" }} />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </Svg>
  );
}

// Descargar: la flecha cae en la bandeja y la bandeja acusa el golpe.
const flecha: Variants = {
  quieto: { y: 0, opacity: 1 },
  animar: { y: [0, 4, -4, 0], opacity: [1, 0, 0, 1], transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.4, 0.5, 1] } },
};
const bandeja: Variants = {
  quieto: { y: 0 },
  animar: { y: [0, 0, 1, 0], transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.75, 0.9, 1] } },
};

export function IconoDescargar({ vez, className }: { vez: number; className?: string }) {
  const controles = useAnimar(vez);
  return (
    <Svg controles={controles} className={className}>
      <m.g variants={flecha}>
        <path d="M12 15V3" />
        <path d="m7 10 5 5 5-5" />
      </m.g>
      <m.path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" variants={bandeja} />
    </Svg>
  );
}

// Copiar: las dos hojas se separan un poco; al copiar, se dibuja la marca.
const hojaDelante: Variants = {
  quieto: { x: 0, y: 0 },
  animar: { x: [0, 1, -0.3, 0], y: [0, 1, -0.3, 0], transition: { duration: 0.6, ease: "easeInOut", times: [0, 0.4, 0.75, 1] } },
};
const hojaDetras: Variants = {
  quieto: { x: 0, y: 0 },
  animar: { x: [0, -1, 0.3, 0], y: [0, -1, 0.3, 0], transition: { duration: 0.6, ease: "easeInOut", times: [0, 0.4, 0.75, 1] } },
};

export function IconoCopiar({ vez, copiado, className }: { vez: number; copiado: boolean; className?: string }) {
  const controles = useAnimar(vez);
  const reducido = useReducedMotion();
  return (
    <Svg controles={controles} className={className}>
      <m.g variants={hojaDelante}>
        {copiado && (
          <m.path
            data-marca
            d="m12 15 2 2 4-4"
            initial={reducido ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        )}
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      </m.g>
      <m.path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" variants={hojaDetras} />
    </Svg>
  );
}

// Volver: la flecha toma impulso y sale hacia atrás.
const empujon: Variants = {
  quieto: { x: 0 },
  animar: { x: [0, 2, -4, 0], transition: { duration: 0.6, ease: "easeInOut", times: [0, 0.2, 0.6, 1] } },
};

export function IconoVolver({ vez, className }: { vez: number; className?: string }) {
  const controles = useAnimar(vez);
  return (
    <Svg controles={controles} className={className}>
      <m.g variants={empujon}>
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </m.g>
    </Svg>
  );
}

// GitHub: el gato mueve la cola.
const cola: Variants = {
  quieto: { rotate: 0 },
  animar: { rotate: [0, -18, 14, -7, 0], transition: { duration: 0.8, ease: "easeInOut" } },
};

export function IconoGitHub({ vez, className }: { vez: number; className?: string }) {
  const controles = useAnimar(vez);
  return (
    <Svg controles={controles} className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <m.path d="M9 18c-4.51 2-5-2-7-2" variants={cola} style={{ transformBox: "view-box", originX: "9px", originY: "18px" }} />
    </Svg>
  );
}

// Certificado: la hoja da un salto y sus renglones se escriben de nuevo.
const salto: Variants = {
  quieto: { scale: 1 },
  animar: { scale: [1, 1.08, 0.98, 1], transition: { duration: 0.6, ease: "easeInOut", times: [0, 0.4, 0.75, 1] } },
};
const renglon = (retraso: number, largo: number): Variants => ({
  quieto: { strokeDashoffset: 0, opacity: 1 },
  animar: {
    strokeDashoffset: [-largo, 0],
    opacity: [0, 1],
    transition: { strokeDashoffset: { duration: 0.4, ease: "easeOut", delay: retraso }, opacity: { duration: 0.25, ease: "easeOut", delay: retraso } },
  },
});

export function IconoCertificado({ vez, className }: { vez: number; className?: string }) {
  const controles = useAnimar(vez);
  return (
    <Svg controles={controles} className={className}>
      <m.g variants={salto} style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}>
        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
        <m.path d="M10 9H8" strokeDasharray="3" variants={renglon(0, 3)} />
        <m.path d="M16 13H8" strokeDasharray="9" variants={renglon(0.15, 9)} />
        <m.path d="M16 17H8" strokeDasharray="9" variants={renglon(0.3, 9)} />
      </m.g>
    </Svg>
  );
}

// Credencial: la insignia late y la marca vuelve a aparecer.
const insignia: Variants = {
  quieto: { scale: 1 },
  animar: { scale: [1, 1.08, 0.97, 1], transition: { duration: 0.6, ease: "easeInOut", times: [0, 0.35, 0.7, 1] } },
};
const visto: Variants = {
  quieto: { opacity: 1, scale: 1 },
  animar: {
    opacity: [0, 1],
    scale: [0.8, 1.12, 1],
    transition: { opacity: { duration: 0.3, delay: 0.15 }, scale: { duration: 0.45, delay: 0.19, times: [0, 0.6, 1], ease: "easeInOut" } },
  },
};

export function IconoCredencial({ vez, className }: { vez: number; className?: string }) {
  const controles = useAnimar(vez);
  return (
    <Svg controles={controles} className={className}>
      <m.path
        d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
        variants={insignia}
        style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path d="m9 12 2 2 4-4" variants={visto} style={{ transformBox: "view-box", originX: "12px", originY: "12px" }} />
    </Svg>
  );
}
