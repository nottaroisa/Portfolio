import { comunidades } from "@/lib/data";
import { Cabecera } from "./Cabecera";
import { Descifrar } from "./Descifrar";

// Código de barras de la credencial: anchos y huecos de 1 a 4 px sacados del nombre.
function codigoDeBarras(semilla: string) {
  let h = 7;
  for (const c of semilla) h = Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0;
  const de1a4 = (n: number) => 1 + (Math.imul(h + n * 97, 2246822519) >>> 30);
  return Array.from({ length: 40 }, (_, i) => ({ ancho: de1a4(2 * i), hueco: de1a4(2 * i + 1) }));
}

// Comunidades como credenciales de evento: cuelgan de su cinta y, con ratón,
// se balancean un poco al pasar por encima.
export function Comunidades() {
  return (
    <section aria-labelledby="comunidades">
      <Cabecera id="comunidades" titulo="Comunidades" nota="Donde aprendo fuera del aula." />
      <ul className="grid gap-x-12 gap-y-16 pt-12 sm:grid-cols-2 lg:max-w-5xl">
        {comunidades.map((c, i) => (
          <li key={c.nombre} className="min-w-0">
            <div
              className={`group relative origin-[50%_-3rem] bg-papel-hondo px-6 pb-6 pt-10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                i % 2 ? "hover:rotate-[1.5deg]" : "hover:-rotate-[1.5deg]"
              }`}
            >
              {/* La cinta y el agujero de la pinza. */}
              <span aria-hidden="true" className="absolute bottom-full left-1/2 h-12 w-[3px] -translate-x-1/2 bg-cobalto" />
              <span aria-hidden="true" className="absolute left-1/2 top-3 h-2.5 w-14 -translate-x-1/2 rounded-full bg-papel" />

              <p className="text-[13px] text-cobalto">{c.papel}</p>
              <h3 className="mt-1 font-serif text-[clamp(2.8rem,5vw,4.2rem)] leading-none transition-colors group-hover:text-cobalto">{c.nombre}</h3>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed">{c.detalle}</p>
              <ul className="mt-4 flex flex-wrap gap-x-5 text-[14px]">
                {c.enlaces.map((e) => (
                  <li key={e.url}>
                    <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 text-cobalto underline underline-offset-4">
                      <Descifrar texto={e.texto} />
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
              <span aria-hidden="true" className="mt-5 flex h-7 overflow-hidden">
                {codigoDeBarras(c.nombre).map((b, j) => (
                  <span key={j} className="shrink-0 bg-tinta" style={{ width: b.ancho, marginRight: b.hueco }} />
                ))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
