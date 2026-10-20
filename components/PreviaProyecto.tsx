import type { Proyecto } from "@/lib/data";
import { TramaImagen } from "./TramaImagen";

// Vista previa de un proyecto hecha con su material real: la estructura de
// ficheros del repositorio o sus propias imágenes.
export function PreviaProyecto({ proyecto, grande = false }: { proyecto: Proyecto; grande?: boolean }) {
  const v = proyecto.vista;

  if (v.tipo === "imagenes") {
    return (
      <div className={`grid gap-2 ${grande ? "grid-cols-[1.4fr_1fr]" : "grid-cols-1"}`}>
        {(grande ? v.imagenes : v.imagenes.slice(0, 1)).map((img) => (
          <TramaImagen key={img.src} src={img.src} alt={img.alt} className="aspect-[4/3]" />
        ))}
      </div>
    );
  }

  // Marco de caracteres de caja: la vista previa también es ASCII.
  const lineas = [v.raiz + "/", ...v.nodos.map((n) => `${n.nivel === 0 ? "├─ " : "│  └─ "}${n.ruta}${n.nivel === 0 ? "/" : ""}`)];

  return (
    <figure className="min-w-0 bg-papel-hondo p-4 text-[12px] leading-[1.6] text-cobalto">
      <figcaption className="mb-2 text-tinta-suave">estructura del repositorio</figcaption>
      <pre className={`overflow-hidden whitespace-pre font-mono ${grande ? "" : "max-h-[220px]"}`}>{lineas.join("\n")}</pre>
    </figure>
  );
}
