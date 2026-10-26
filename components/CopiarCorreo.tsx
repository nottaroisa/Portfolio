"use client";

import { useEffect, useRef, useState } from "react";
import { Descifrar } from "./Descifrar";
import { IconoCopiar, useVezAlPasar } from "./IconosAnimados";

type Estado = "listo" | "copiado" | "error";

const avisos: Record<Estado, string> = {
  listo: "clic para copiar",
  copiado: "copiado",
  error: "no se pudo copiar: usa «Escríbeme un correo»",
};

// El correo en grande: al pulsarlo se copia y el aviso de al lado se descifra
// en "copiado". Para escribir directamente está el botón de debajo.
export function CopiarCorreo({ correo }: { correo: string }) {
  const [estado, setEstado] = useState<Estado>("listo");
  const volver = useRef(0);
  const [usuario, dominio] = correo.split("@");
  const { vez, alPasar } = useVezAlPasar();

  async function copiar() {
    try {
      await navigator.clipboard.writeText(correo);
      setEstado("copiado");
    } catch {
      // Portapapeles bloqueado (permisos o navegador antiguo): se dice y se ofrece el mailto.
      setEstado("error");
    }
    window.clearTimeout(volver.current);
    volver.current = window.setTimeout(() => setEstado("listo"), 2600);
  }

  useEffect(() => () => window.clearTimeout(volver.current), []);

  return (
    <div>
      <p className="text-[13px] text-tinta-suave">
        correo ·{" "}
        <span role="status" className={estado === "copiado" ? "text-cobalto" : undefined}>
          <Descifrar key={estado} texto={avisos[estado]} lanzarAl={estado === "listo" ? undefined : "montar"} />
        </span>
      </p>
      <button
        type="button"
        onClick={copiar}
        {...alPasar}
        aria-label={`Copiar el correo ${correo}`}
        className="mt-1 block cursor-copy text-left font-serif text-[clamp(1.9rem,4.4vw,4rem)] leading-tight text-cobalto decoration-2 underline-offset-[0.18em] transition-transform duration-150 ease-out hover:underline active:scale-[0.99]"
      >
        {/* Si no cabe en una línea, se parte por la arroba y no a mitad de palabra. */}
        {usuario}@<wbr />
        {dominio}
        <IconoCopiar vez={vez} copiado={estado === "copiado"} className="ml-[0.25em] h-[0.55em] w-[0.55em] align-[0.1em]" />
      </button>
    </div>
  );
}
