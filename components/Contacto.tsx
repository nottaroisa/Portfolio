import { correoPreparado, gmailPreparado } from "@/lib/correo";
import { enlaces, perfil } from "@/lib/data";
import { Cabecera } from "./Cabecera";
import { CopiarCorreo } from "./CopiarCorreo";
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
  return (
    <section aria-labelledby="contacto">
      <Cabecera id="contacto" titulo="Contacto" nota="Respondo antes al correo que a los mensajes directos." />
      <div className="grid gap-12 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-end">
        <div>
          <CopiarCorreo correo={enlaces.correo} />
          {/* La acción principal: un correo con el asunto y el saludo ya puestos. */}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[14px]">
            <a
              href={correoPreparado}
              className="inline-block bg-cobalto px-4 py-2.5 font-bold text-papel transition-transform duration-150 ease-out hover:bg-cobalto-hondo active:scale-[0.97]"
            >
              <Descifrar texto="Escríbeme un correo" />
            </a>
            <a
              href={enlaces.cv}
              download
              className="inline-block border-2 border-cobalto px-4 py-2 font-bold text-cobalto transition-transform duration-150 ease-out hover:bg-cobalto hover:text-papel active:scale-[0.97]"
            >
              <Descifrar texto="Descargar CV (PDF)" />
            </a>
          </div>
          <p className="mt-3 text-[13px] text-tinta-suave">
            ¿Usas Gmail?{" "}
            <a href={gmailPreparado} target="_blank" rel="noopener noreferrer" className="inline-block py-1 text-cobalto underline underline-offset-4">
              Escríbeme desde Gmail<span aria-hidden="true"> ↗</span>
            </a>
          </p>
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
