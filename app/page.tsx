import { Hero } from "@/components/Hero";
import { Pie } from "@/components/Pie";
import { Secciones } from "@/components/Secciones";

export default function Inicio() {
  return (
    <>
      <main>
        <Hero />
        <Secciones />
      </main>
      <Pie />
    </>
  );
}
