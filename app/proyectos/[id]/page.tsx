import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cifras } from "@/components/Cifras";
import { Cortinilla } from "@/components/Cortinilla";
import { Pie } from "@/components/Pie";
import { PreviaProyecto } from "@/components/PreviaProyecto";
import { Texto } from "@/components/Texto";
import { perfil, proyectos } from "@/lib/data";

// Una página por proyecto, generada al compilar (exportación estática).
export const dynamicParams = false;
export function generateStaticParams() {
  return proyectos.map((p) => ({ id: p.id }));
}

export async function generateMetadata(props: PageProps<"/proyectos/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const p = proyectos.find((x) => x.id === id);
  return { title: p ? `${p.nombre} · ${perfil.nombre}` : perfil.nombre, description: p?.problema };
}

export default async function PaginaProyecto(props: PageProps<"/proyectos/[id]">) {
  const { id } = await props.params;
  const i = proyectos.findIndex((x) => x.id === id);
  if (i === -1) notFound();
  const p = proyectos[i];
  const siguiente = proyectos[(i + 1) % proyectos.length];

  const filas: [string, string][] = [
    ["Problema", p.problema],
    ["Mi rol", p.rol],
    ["Resultado", p.resultado],
  ];

  return (
    <>
      <Cortinilla />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 md:px-10">
        <nav aria-label="Navegación del proyecto" className="flex flex-wrap justify-between gap-4 pr-14 text-[13px] sm:pr-16 md:pr-44">
          <Link href="/#proyectos" className="hover:text-cobalto">
            ← Volver a los proyectos
          </Link>
          <span className="text-tinta-suave">{perfil.nombre}</span>
        </nav>

        <header className="mt-16 border-b-2 border-tinta pb-6">
          <p className="text-[13px] text-cobalto">
            {p.tipo}
            {p.estado ? ` (${p.estado.toLowerCase()})` : ""}
          </p>
          <h1 className="mt-2 font-serif text-[clamp(3rem,10vw,9rem)] leading-[0.88]">
            <Cifras>{p.nombre}</Cifras>
          </h1>
        </header>

        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <PreviaProyecto proyecto={p} grande />
          <div>
            <dl className="space-y-6 text-[15px] leading-relaxed">
              {filas.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[13px] text-cobalto">{k}</dt>
                  <dd className="mt-1">
                    <Texto>{v}</Texto>
                  </dd>
                </div>
              ))}
              <div>
                <dt className="text-[13px] text-cobalto">Stack</dt>
                <dd className="mt-1">{p.stack.join(", ")}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-[14px]">
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="bg-cobalto px-4 py-2 font-bold text-papel hover:bg-cobalto-hondo">
                  Ver el código en GitHub
                </a>
              )}
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Abrir la demo
                </a>
              )}
              {p.pendiente && (
                <span className="text-[13px]">
                  <Texto>{p.pendiente}</Texto>
                </span>
              )}
            </div>
          </div>
        </div>

        <Link href={`/proyectos/${siguiente.id}`} className="group mt-24 block border-t-2 border-tinta pt-4">
          <span className="text-[13px] text-tinta-suave">Siguiente proyecto</span>
          <span className="block font-serif text-[clamp(2.2rem,6vw,5rem)] leading-none group-hover:text-cobalto">
            <Cifras>{siguiente.nombre}</Cifras>
          </span>
        </Link>
      </main>
      <Pie />
    </>
  );
}
