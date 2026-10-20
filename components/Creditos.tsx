import { contenido, urlDeVideo } from "@/lib/data";
import { Texto } from "./Texto";

// Dominio legible de una web: "https://www.mi.com/es/" → "mi.com".
const dominio = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function Reproducir() {
  return (
    <svg viewBox="0 0 10 12" aria-hidden="true" className="h-[0.7em] w-[0.6em] shrink-0 fill-current">
      <path d="M0 0 10 6 0 12Z" />
    </svg>
  );
}

// El anillo de una historia de Instagram, para las colaboraciones que no fueron un vídeo.
function Historia() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-[0.75em] w-[0.75em] shrink-0">
      <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

// Las marcas con las que he trabajado, como los créditos del final de un vídeo:
// el nombre a un lado del eje central y, al otro, los vídeos en los que sale y
// su web.
export function Creditos() {
  return (
    <div className="mt-16">
      <h3 className="text-center font-serif text-[clamp(1.8rem,3vw,2.6rem)] italic leading-none">Créditos</h3>
      <p className="mt-2 text-center text-[13px] text-tinta-suave">Marcas con las que he trabajado, sus vídeos y su web.</p>

      <ul aria-label="Marcas con las que he trabajado" className="mt-8 border-t border-linea">
        {contenido.marcas.map((m) => (
          <li
            key={m.nombre}
            className="group grid gap-x-12 gap-y-2 border-b border-linea py-5 transition-colors md:grid-cols-2 md:items-center md:py-6 [@media(hover:hover)]:hover:bg-papel-hondo"
          >
            <p className="font-serif text-[clamp(2rem,4.5vw,3.6rem)] leading-none transition-colors group-hover:text-cobalto md:text-right">{m.nombre}</p>
            <div className="text-[14px]">
              {m.videos.length > 0 && (
                <ul>
                  {m.videos.map((v) => (
                    <li key={v.id}>
                      <a
                        href={urlDeVideo(v)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-baseline gap-2 py-1 hover:text-cobalto hover:underline hover:underline-offset-4"
                      >
                        <span className="text-cobalto">
                          <Reproducir />
                        </span>
                        {v.titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {m.nota && (
                <p className="flex items-baseline gap-2 py-1">
                  <span className="text-cobalto">
                    <Historia />
                  </span>
                  {m.nota}
                </p>
              )}
              {m.pendiente && (
                <p className="py-1 text-[13px]">
                  <Texto>{m.pendiente}</Texto>
                </p>
              )}
              <a href={m.web} target="_blank" rel="noopener noreferrer" className="inline-block py-1 text-[13px] text-tinta-suave hover:text-cobalto">
                {dominio(m.web)}
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
