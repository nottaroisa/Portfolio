import { perfil } from "@/lib/data";

export function Pie() {
  return (
    <footer className="border-t-2 border-tinta">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 py-6 text-[12px] text-tinta-suave sm:px-6 md:px-10">
        <p>{perfil.nombre}, 2026.</p>
        <p>Hecho con Next.js, Tailwind y framer-motion. Los caracteres se dibujan en un canvas.</p>
      </div>
    </footer>
  );
}
