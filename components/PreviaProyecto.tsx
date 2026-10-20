import type { Proyecto } from "@/lib/data";
import { TramaImagen } from "./TramaImagen";

type Nodo = { ruta: string; nivel: number };

// ¿Le quedan hermanos debajo? Si no, su rama es └─ y su carpeta deja de tener │.
function esUltimo(nodos: Nodo[], i: number) {
  for (let j = i + 1; j < nodos.length; j++) {
    if (nodos[j].nivel < nodos[i].nivel) return true;
    if (nodos[j].nivel === nodos[i].nivel) return false;
  }
  return true;
}

// Árbol de ficheros como el de la consola: ├─ para cada hermano, └─ para el
// último y │ mientras la carpeta de arriba siga teniendo hermanos.
function dibujarArbol(raiz: string, nodos: Nodo[]) {
  const lineas = [raiz + "/"];
  let carpetaUltima = false;
  nodos.forEach((nodo, i) => {
    const rama = esUltimo(nodos, i) ? "└─ " : "├─ ";
    if (nodo.nivel === 0) {
      carpetaUltima = esUltimo(nodos, i);
      lineas.push(`${rama}${nodo.ruta}/`);
    } else {
      lineas.push(`${carpetaUltima ? "   " : "│  "}${rama}${nodo.ruta}`);
    }
  });
  return lineas;
}

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
  const lineas = dibujarArbol(v.raiz, v.nodos);

  return (
    <figure className="min-w-0 bg-papel-hondo p-4 text-[12px] leading-[1.6] text-cobalto">
      <figcaption className="mb-2 text-tinta-suave">estructura del repositorio</figcaption>
      <pre className={`overflow-hidden whitespace-pre font-mono ${grande ? "" : "max-h-[220px]"}`}>{lineas.join("\n")}</pre>
    </figure>
  );
}
