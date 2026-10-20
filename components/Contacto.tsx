import { enlaces, perfil } from "@/lib/data";
import { Cabecera } from "./Cabecera";
import { Descifrar } from "./Descifrar";

const redes: [string, string][] = [
  ["LinkedIn", enlaces.linkedin],
  ["GitHub", enlaces.github],
  ["TikTok", enlaces.tiktok],
  ["Blog", enlaces.blog],
];

// Contacto: el correo como titular, porque es la acción que importa, y al lado
// una ficha con el estado (si estoy disponible) y las redes.
export function Contacto() {
  const [usuario, dominio] = enlaces.correo.split("@");

  return (
    <section aria-labelledby="contacto">
      <Cabecera id="contacto" titulo="Contacto" nota="Respondo antes al correo que a los mensajes directos." />
      <div className="grid gap-12 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-end">
        <div>
          <p className="text-[13px] text-tinta-suave">correo</p>
          <a
            href={`mailto:${enlaces.correo}`}
            className="mt-1 block font-serif text-[clamp(1.9rem,4.4vw,4rem)] leading-tight text-cobalto hover:underline"
          >
            {/* Si no cabe en una línea, se parte por la arroba y no a mitad de palabra. */}
            {usuario}@<wbr />
            {dominio}
          </a>
          <a href={enlaces.cv} download className="mt-8 inline-block bg-cobalto px-4 py-2.5 text-[14px] font-bold text-papel hover:bg-cobalto-hondo">
            <Descifrar texto="Descargar CV (PDF)" />
          </a>
        </div>

        <dl className="text-[14px]">
          <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-t border-linea py-3">
            <dt className="text-cobalto">estado</dt>
            <dd className="flex items-baseline gap-2.5">
              <span aria-hidden="true" className="punto-vivo translate-y-[-0.1em]" />
              {perfil.estado}
            </dd>
          </div>
          <div className="grid grid-cols-[5.5rem_1fr] gap-3 border-y border-linea py-3">
            <dt className="text-cobalto">redes</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-5">
                {redes.map(([nombre, url]) => (
                  <li key={nombre}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 hover:text-cobalto">
                      <Descifrar texto={nombre} />
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
