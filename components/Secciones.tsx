import { certificaciones, estudios, experiencia, perfil, proyectos, type Entrada } from "@/lib/data";
import { Cabecera } from "./Cabecera";
import { Comunidades } from "./Comunidades";
import { Contacto } from "./Contacto";
import { CreoContenido } from "./CreoContenido";
import { ListaProyectos } from "./ListaProyectos";
import { Texto } from "./Texto";

// Un certificado o una credencial que se abre en una pestaña nueva desde su miniatura.
// Todas las miniaturas van en el mismo marco (4:3) y se ven enteras dentro de él.
function Miniatura({ href, imagen, texto }: { href: string; imagen: string; texto: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group mt-3 flex w-fit items-end gap-3 text-[13px] text-cobalto">
      {/* eslint-disable-next-line @next/next/no-img-element -- web estática sin optimizador de imágenes */}
      <img
        src={`/certificados/${imagen}.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="aspect-[4/3] w-32 shrink-0 border-2 border-cobalto bg-white object-contain transition-transform duration-200 ease-out group-hover:-rotate-1 group-hover:scale-[1.04]"
      />
      <span className="underline underline-offset-4">
        {texto}
        <span aria-hidden="true"> ↗</span>
      </span>
    </a>
  );
}

function Listado({ entradas }: { entradas: Entrada[] }) {
  return (
    <ol>
      {entradas.map((e) => (
        <li key={e.titulo} className="grid gap-x-8 gap-y-1 border-b border-linea py-5 md:grid-cols-[12rem_minmax(0,1fr)]">
          <p className="text-[13px] text-cobalto">
            <Texto>{e.fechas}</Texto>
          </p>
          <div>
            <h3 className="font-serif text-[28px] leading-tight">
              <Texto>{e.titulo}</Texto>
            </h3>
            <p className="text-[13px] text-tinta-suave">
              <Texto>{e.lugar}</Texto>
            </p>
            {e.detalle && (
              <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed">
                <Texto>{e.detalle}</Texto>
              </p>
            )}
            {e.certificado && (
              <Miniatura href={`/certificados/${e.certificado}.pdf`} imagen={e.certificado} texto="Ver certificado (PDF)" />
            )}
            {e.enlace &&
              (e.miniatura ? (
                <Miniatura href={e.enlace} imagen={e.miniatura} texto="Ver credencial" />
              ) : (
                <a href={e.enlace} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block py-1 text-[13px] text-cobalto underline underline-offset-4">
                  Ver credencial<span aria-hidden="true"> ↗</span>
                </a>
              ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Secciones() {
  const ficha: [string, string][] = [
    ["estudia", perfil.estudia],
    ["stack", perfil.stack.join(", ")],
    ["busca", perfil.busca],
    ["idiomas", perfil.idiomas],
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-32 px-4 pb-24 pt-8 sm:px-6 md:px-10">
      <section aria-labelledby="proyectos">
        <Cabecera id="proyectos" titulo="Proyectos" nota={`Los ${proyectos.length} fijados en mi GitHub.`} />
        <ListaProyectos />
      </section>

      {/* Sobre mí: el texto de tu CV, grande, y los datos clave a un lado. */}
      <section aria-labelledby="sobre-mi" className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <Cabecera id="sobre-mi" titulo="Sobre mí" />
          <div className="space-y-5 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.2]">
            {perfil.sobreMi.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <dl className="self-end text-[13px]">
          {ficha.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6rem_1fr] gap-3 border-t border-linea py-2.5">
              <dt className="text-cobalto">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="experiencia">
        <Cabecera id="experiencia" titulo="Experiencia" nota="Del CV, de lo más reciente a lo más antiguo." />
        <Listado entradas={experiencia} />
      </section>

      <section aria-labelledby="estudios">
        <Cabecera id="estudios" titulo="Estudios" nota="Actuales y anteriores." />
        <Listado entradas={estudios} />
      </section>

      <section aria-labelledby="certificaciones">
        <Cabecera id="certificaciones" titulo="Certificaciones" nota="Licencias y certificados, con su credencial cuando la tiene." />
        <Listado entradas={certificaciones} />
      </section>

      <CreoContenido />

      <Comunidades />

      <Contacto />
    </div>
  );
}
