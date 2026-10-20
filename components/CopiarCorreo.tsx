"use client";

import { useEffect, useRef, useState } from "react";
import { Descifrar } from "./Descifrar";

type Estado = "listo" | "copiado" | "error";

const avisos: Record<Estado, string> = {
  listo: "clic para copiar",
  copiado: "copiado",
  error: "no se pudo copiar: ábrelo en tu correo",
};

// El correo en grande: al pulsarlo se copia y el aviso de al lado se descifra
// en "copiado". Para quien prefiera escribir directamente, queda el enlace mailto.
export function CopiarCorreo({ correo }: { correo: string }) {
  const [estado, setEstado] = useState<Estado>("listo");
  const volver = useRef(0);
  const [usuario, dominio] = correo.split("@");

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
      <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[13px] text-tinta-suave">
        <span>
          correo ·{" "}
          <span role="status" className={estado === "copiado" ? "text-cobalto" : undefined}>
            <Descifrar key={estado} texto={avisos[estado]} alMontar={estado !== "listo"} />
          </span>
        </span>
        <a href={`mailto:${correo}`} className="inline-block py-1 hover:text-cobalto">
          abrir en tu correo<span aria-hidden="true"> ↗</span>
        </a>
      </p>
      <button
        type="button"
        onClick={copiar}
        aria-label={`Copiar el correo ${correo}`}
        className="mt-1 block cursor-copy text-left font-serif text-[clamp(1.9rem,4.4vw,4rem)] leading-tight text-cobalto decoration-2 underline-offset-[0.18em] transition-transform duration-150 ease-out hover:underline active:scale-[0.99]"
      >
        {/* Si no cabe en una línea, se parte por la arroba y no a mitad de palabra. */}
        {usuario}@<wbr />
        {dominio}
      </button>
    </div>
  );
}
