import type { Metadata } from "next";
import { Cortinilla } from "@/components/Cortinilla";
import { EnlaceConIcono } from "@/components/EnlaceConIcono";
import { Pie } from "@/components/Pie";
import { grupos, type Credito } from "@/lib/creditos";
import { contenido, enlaces, perfil } from "@/lib/data";

export const metadata: Metadata = {
  title: `Créditos y licencias · ${perfil.nombre}`,
  description: "De dónde sale cada cosa de la web que no he hecho yo y con qué licencia se usa.",
};

function Enlace({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-cobalto underline underline-offset-4">
      {children}
    </a>
  );
}

function Fila({ c }: { c: Credito }) {
  return (
    <li className="grid gap-1 border-t border-linea py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8">
      <p className="text-[15px]">
        <Enlace href={c.url}>{c.nombre}</Enlace>
        {c.autor && (
          <>
            {" "}
            de <Enlace href={c.autor.url}>{c.autor.nombre}</Enlace>
          </>
        )}
        <span className="mt-1 block text-[13px] text-tinta-suave">
          Licencia: {c.licencia.url ? <Enlace href={c.licencia.url}>{c.licencia.nombre}</Enlace> : c.licencia.nombre}
        </span>
      </p>
      <p className="text-[14px] leading-relaxed">{c.uso}</p>
    </li>
  );
}

// Créditos y licencias: lo que viene de fuera, con el crédito que pide cada
// licencia, y lo que es mío o de quien lo emitió.
export default function Creditos() {
  return (
    <>
      <Cortinilla />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 md:px-10">
        <nav aria-label="Navegación de créditos" className="flex flex-wrap justify-between gap-4 pr-14 text-[13px] sm:pr-16 md:pr-44">
          <EnlaceConIcono icono="volver" href="/" className="hover:text-cobalto">
            Volver al inicio
          </EnlaceConIcono>
          <span className="text-tinta-suave">{perfil.nombre}</span>
        </nav>

        <header className="mt-16 border-b-2 border-tinta pb-6">
          <h1 className="font-serif text-[clamp(3rem,10vw,9rem)] leading-[0.88]">Créditos y licencias</h1>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed">
            La web la ha sido pensada, diseñada y creada por mí, con ayuda de algunas IAs para ampliar conocimiento y apoyarme en cuestiones que no tuviera tiempo de alcanzar. Aquí está lo que viene de fuera: de dónde sale, quién lo hizo, con qué licencia
            se usa y qué he cambiado.
          </p>
        </header>

        <div className="mt-16 space-y-20">
          {grupos.map((g) => (
            <section key={g.titulo} aria-labelledby={`grupo-${g.titulo}`}>
              <h2 id={`grupo-${g.titulo}`} className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-none">
                {g.titulo}
              </h2>
              <p className="mt-2 text-[13px] text-tinta-suave">{g.nota}</p>
              <ul className="mt-6">
                {g.creditos.map((c) => (
                  <Fila key={c.nombre} c={c} />
                ))}
              </ul>
            </section>
          ))}

          <section aria-labelledby="grupo-contenido">
            <h2 id="grupo-contenido" className="font-serif text-[clamp(2rem,4vw,3.2rem)] leading-none">
              Contenido
            </h2>
            <p className="mt-2 text-[13px] text-tinta-suave">Lo que es mío y lo que es de quien lo emitió.</p>
            <ul className="mt-6 text-[14px] leading-relaxed">
              <li className="border-t border-linea py-4">
                Los vídeos y sus portadas son míos, de mi cuenta de TikTok <Enlace href={enlaces.tiktok}>{contenido.usuario}</Enlace>. Se
                reproducen con el reproductor de TikTok, que solo se carga al pulsar cada vídeo.
              </li>
              <li className="border-t border-linea py-4">
                Las marcas con las que he colaborado (Xiaomi, Huawei, Telefónica, PcComponentes, AliExpress, Temu, Lewitt y Eneryeti) y sus nombres son de
                sus propietarios. Salen solo como créditos de mi trabajo, sin logotipos.
              </li>
              <li className="border-t border-linea py-4">
                Los certificados son documentos emitidos por Trinity College London, WordPress, la Fundación INCYDE y Pearson (credencial de Credly). Los
                enseño como prueba de mi formación; en el de Trinity he tapado el número del DNI.
              </li>
              <li className="border-t border-linea py-4">
                La captura del moodboard, los árboles de los repositorios, el campo ASCII, el monograma IFNS y el resto de los textos y dibujos son míos.
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Pie />
    </>
  );
}
