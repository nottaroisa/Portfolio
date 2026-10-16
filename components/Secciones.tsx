import { contenido, enlaces, estudios, experiencia, perfil, proyectos, type Entrada } from "@/lib/data";
import { Descifrar } from "./Descifrar";
import { ListaProyectos } from "./ListaProyectos";
import { Texto } from "./Texto";

// Cabecera de sección: el título en serif y, a la derecha, una línea en
// monoespaciada que dice qué hay dentro.
function Cabecera({ id, titulo, nota }: { id: string; titulo: string; nota?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b-2 border-tinta pb-3">
      <h2 id={id} className="font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.9]">
        {titulo}
      </h2>
      {nota && <p className="text-[13px] text-tinta-suave">{nota}</p>}
    </div>
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
        <Cabecera id="proyectos" titulo="Proyectos" nota={`${proyectos.length} proyectos. Pasa el ratón para ver cada uno.`} />
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

      <section aria-labelledby="contenido">
        <Cabecera id="contenido" titulo="Comunico tecnología" nota={`TikTok @SrtaJeans desde ${contenido.desde}.`} />
        <p className="max-w-[62ch] text-[15px] leading-relaxed">{contenido.porQueImporta}</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-1 font-serif text-[clamp(1.8rem,4vw,3.4rem)] leading-tight">
          {contenido.marcas.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="mt-6 text-[13px]">
          <Texto>{contenido.videos}</Texto>
        </p>
        <div className="mt-4 flex flex-wrap gap-6 text-[14px]">
          <a href={enlaces.tiktok} target="_blank" rel="noopener noreferrer" className="text-cobalto underline underline-offset-4">
            <Descifrar texto="Ver mi TikTok" />
          </a>
          <a href={enlaces.blog} target="_blank" rel="noopener noreferrer" className="text-cobalto underline underline-offset-4">
            <Descifrar texto="Leer mi blog" />
          </a>
        </div>
      </section>

      {/* Contacto: el correo como titular, porque es la acción que importa. */}
      <section aria-labelledby="contacto">
        <Cabecera id="contacto" titulo="Contacto" nota="Respondo antes al correo que a los mensajes directos." />
        <a
          href={`mailto:${enlaces.correo}`}
          className="block break-all font-serif text-[clamp(1.6rem,4.4vw,4rem)] leading-tight text-cobalto hover:underline"
        >
          {enlaces.correo}
        </a>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px]">
          <a href={enlaces.cv} download className="bg-cobalto px-4 py-2 font-bold text-papel hover:bg-cobalto-hondo">
            <Descifrar texto="Descargar CV (PDF)" />
          </a>
          <a href={enlaces.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-cobalto">
            <Descifrar texto="LinkedIn" />
          </a>
          <a href={enlaces.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-cobalto">
            <Descifrar texto="GitHub" />
          </a>
          <a href={enlaces.tiktok} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-cobalto">
            <Descifrar texto="TikTok" />
          </a>
          <a href={enlaces.blog} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-cobalto">
            <Descifrar texto="Blog" />
          </a>
        </div>
      </section>
    </div>
  );
}
