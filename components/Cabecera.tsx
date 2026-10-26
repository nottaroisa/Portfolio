import { Modelo3D } from "./ascii/Modelo3D";

// Cabecera de sección: el título en serif y, a la derecha, una línea en
// monoespaciada que dice qué hay dentro. Con `modelo`, junto al título gira un
// objeto 3D teñido con la tinta azul, apoyado en la raya como en una estantería.
export function Cabecera({ id, titulo, nota, modelo }: { id: string; titulo: string; nota?: string; modelo?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b-2 border-tinta pb-3">
      <div className="flex flex-wrap items-end gap-x-6">
        <h2 id={id} className="font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.9]">
          {titulo}
        </h2>
        {modelo && <Modelo3D modelo={modelo} className="-mb-3 hidden sm:block" />}
      </div>
      {nota && <p className="text-[13px] text-tinta-suave">{nota}</p>}
    </div>
  );
}
