// De dónde sale cada cosa de la web que no he hecho yo, con su licencia y el
// crédito que pide. Se lee en /creditos.

export type Credito = {
  nombre: string;
  url: string;
  autor?: { nombre: string; url: string };
  licencia: { nombre: string; url?: string };
  // Dónde se usa en la web y, si hace falta, qué se ha cambiado.
  uso: string;
};

export type Grupo = { titulo: string; nota: string; creditos: Credito[] };

export const grupos: Grupo[] = [
  {
    titulo: "Modelos 3D",
    nota: "Los objetos que giran junto al título de algunas secciones. Pierden sus colores y se tiñen con la tinta azul de la web.",
    creditos: [
      {
        nombre: "Graduation Hat",
        url: "https://sketchfab.com/3d-models/graduation-hat-b0a7e821403b4c8cb8e1d32ea4075eac",
        autor: { nombre: "DevFaisal", url: "https://sketchfab.com/DevFaisal" },
        licencia: { nombre: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
        uso: "El birrete de Estudios. Lo he simplificado (de 85.000 triángulos a unos 2.000) y comprimido con Draco para que pese 23 KB.",
      },
      {
        nombre: "Laptop, Monitor, Keyboard, Headphones y Faceout Book",
        url: "https://threejsassets.com/assets/free",
        autor: { nombre: "threejsassets", url: "https://threejsassets.com" },
        licencia: { nombre: "Free Commercial License, licencia propia de threejsassets: uso libre sin atribución obligatoria", url: "https://threejsassets.com/license" },
        uso: "El portátil de Proyectos, el monitor y el teclado de Experiencia, los auriculares de Creo contenido y el libro de Certificaciones. Sin cambios.",
      },
    ],
  },
  {
    titulo: "Iconos",
    nota: "Los iconos animados de los botones.",
    creditos: [
      {
        nombre: "animateicons",
        url: "https://github.com/Avijit07x/animateicons",
        autor: { nombre: "Avijit Dey", url: "https://github.com/Avijit07x" },
        licencia: { nombre: "MIT", url: "https://github.com/Avijit07x/animateicons/blob/main/LICENSE" },
        uso: "Sobre, descargar, copiar, volver, GitHub, certificado y credencial. Adaptados al LazyMotion de la web.",
      },
      {
        nombre: "Lucide",
        url: "https://lucide.dev",
        licencia: { nombre: "ISC", url: "https://lucide.dev/license" },
        uso: "Las formas de esos iconos.",
      },
    ],
  },
  {
    titulo: "Tipografía",
    nota: "Las dos letras de la web, servidas desde la propia web.",
    creditos: [
      {
        nombre: "Instrument Serif",
        url: "https://fonts.google.com/specimen/Instrument+Serif",
        autor: { nombre: "Instrument", url: "https://www.instrument.com" },
        licencia: { nombre: "SIL OFL 1.1", url: "https://openfontlicense.org" },
        uso: "Los titulares y mi nombre.",
      },
      {
        nombre: "Space Mono",
        url: "https://fonts.google.com/specimen/Space+Mono",
        autor: { nombre: "Colophon Foundry", url: "https://www.colophon-foundry.org" },
        licencia: { nombre: "SIL OFL 1.1", url: "https://openfontlicense.org" },
        uso: "El texto, los caracteres del campo ASCII y la portada.",
      },
    ],
  },
  {
    titulo: "Código",
    nota: "Las librerías con las que está hecha la web.",
    creditos: [
      { nombre: "Next.js", url: "https://nextjs.org", licencia: { nombre: "MIT" }, uso: "El framework: las páginas y la exportación estática." },
      { nombre: "React", url: "https://react.dev", licencia: { nombre: "MIT" }, uso: "Los componentes." },
      { nombre: "Tailwind CSS", url: "https://tailwindcss.com", licencia: { nombre: "MIT" }, uso: "Los estilos." },
      { nombre: "framer-motion", url: "https://motion.dev", licencia: { nombre: "MIT" }, uso: "Las animaciones de la máscara del nombre, la vista previa y los iconos." },
      { nombre: "three.js", url: "https://threejs.org", licencia: { nombre: "MIT" }, uso: "Pinta los modelos 3D." },
      {
        nombre: "Draco",
        url: "https://github.com/google/draco",
        autor: { nombre: "Google", url: "https://github.com/google" },
        licencia: { nombre: "Apache 2.0", url: "https://www.apache.org/licenses/LICENSE-2.0" },
        uso: "El descompresor de los modelos 3D, tal como viene con three.js.",
      },
      {
        nombre: "ui-layouts",
        url: "https://github.com/ui-layouts/ui-layouts",
        licencia: { nombre: "MIT" },
        uso: "La idea de la máscara de texto, la vista previa que sigue al cursor y el texto que se descifra. Reescritos para esta web.",
      },
    ],
  },
];
