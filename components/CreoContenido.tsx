import { contenido, enlaces } from "@/lib/data";
import { Cabecera } from "./Cabecera";
import { Creditos } from "./Creditos";
import { Descifrar } from "./Descifrar";
import { VideoTikTok } from "./VideoTikTok";

// Cifra de la cuenta: se "calcula" al entrar en pantalla, solo barajando dígitos.
function Cifra({ valor }: { valor: string }) {
  return (
    <strong className="font-normal text-cobalto [font-variant-numeric:tabular-nums]">
      <Descifrar texto={valor} lanzarAl="ver" soloCifras duracion={700} />
    </strong>
  );
}

// Creo contenido: qué hago en TikTok, cuánto alcance tiene y con qué marcas he trabajado.
export function CreoContenido() {
  return (
    <section aria-labelledby="contenido">
      <Cabecera id="contenido" titulo="Creo contenido" modelo="headphones" nota={`TikTok ${contenido.usuario} desde ${contenido.desde}.`} />

      <div className="grid gap-x-16 gap-y-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <p className="font-serif text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15]">
          Me siguen <Cifra valor={contenido.seguidores} /> personas, mis vídeos suman <Cifra valor={contenido.meGusta} /> de me gusta y
          llevo <Cifra valor={contenido.videosPublicados} /> publicados.
        </p>
        <div className="self-end text-[15px] leading-relaxed">
          <p>{contenido.resumen}</p>
          <p className="mt-3 text-[13px] text-tinta-suave">Datos públicos del perfil, {contenido.fecha}.</p>
        </div>
      </div>

      {/* En el móvil, carrusel horizontal que encaja cada vídeo; en tablet, de dos en dos; en escritorio, en fila. */}
      <ul className="-mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 lg:grid-cols-4">
        {contenido.videos.map((v) => (
          <li key={v.id} className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto">
            <VideoTikTok video={v} />
          </li>
        ))}
      </ul>

      <a href={enlaces.tiktok} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block py-1 text-[14px] text-cobalto underline underline-offset-4">
        <Descifrar texto="Ver mi TikTok" />
        <span aria-hidden="true"> ↗</span>
      </a>

      <Creditos />
    </section>
  );
}
