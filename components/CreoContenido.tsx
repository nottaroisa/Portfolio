import { contenido, enlaces } from "@/lib/data";
import { Cabecera } from "./Cabecera";
import { Descifrar } from "./Descifrar";

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
      <Cabecera id="contenido" titulo="Creo contenido" nota={`TikTok ${contenido.usuario} desde ${contenido.desde}.`} />

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

      <p className="mt-14 text-[13px] text-tinta-suave">He trabajado con</p>
      <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-1 font-serif text-[clamp(1.8rem,4vw,3.4rem)] leading-tight">
        {contenido.marcas.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-6 text-[14px]">
        <a href={enlaces.tiktok} target="_blank" rel="noopener noreferrer" className="inline-block py-1 text-cobalto underline underline-offset-4">
          <Descifrar texto="Ver mi TikTok" />
          <span aria-hidden="true"> ↗</span>
        </a>
        <a href={enlaces.blog} target="_blank" rel="noopener noreferrer" className="inline-block py-1 text-cobalto underline underline-offset-4">
          <Descifrar texto="Leer mi blog" />
          <span aria-hidden="true"> ↗</span>
        </a>
      </div>
    </section>
  );
}
