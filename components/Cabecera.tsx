// Cabecera de sección: el título en serif y, a la derecha, una línea en
// monoespaciada que dice qué hay dentro.
export function Cabecera({ id, titulo, nota }: { id: string; titulo: string; nota?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b-2 border-tinta pb-3">
      <h2 id={id} className="font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.9]">
        {titulo}
      </h2>
      {nota && <p className="text-[13px] text-tinta-suave">{nota}</p>}
    </div>
  );
}
