// Contenido de la web. Lo marcado con [PENDIENTE: ...] está por completar
// y se muestra resaltado en la página hasta entonces.

export const perfil = {
  nombre: "Isabella Nottaro Sánchez",
  lema: "No entiendo la tecnología sin la creatividad.",
  estudia: "2º DAM en CPR Liceo La Paz",
  stack: ["Java", "MySQL", "HTML", "CSS", "Git"],
  busca: "Prácticas (FCT) de backend o full stack",
  estado: "Disponible para prácticas (FCT) de backend o full stack",
  idiomas: "Castellano e inglés B2 (Trinity)",
  // Tomado del "Sobre mí" de mi CV (octubre de 2026).
  sobreMi: [
    "Estudio 2º de DAM y me oriento al desarrollo full stack, con base en Java, MySQL, HTML y CSS. Complemento el ciclo con formación propia en WordPress, IA generativa y transformación digital.",
    "Soy creadora de contenido profesional desde 2020: he aprendido a organizarme con autonomía, a responsabilizarme del resultado final y a mejorar con cada entrega.",
    "La hostelería me enseñó a trabajar en equipo y a mantener la calma cuando el trabajo se acumula.",
  ],
} as const;

export const enlaces = {
  linkedin: "https://www.linkedin.com/in/isabellanottarosanchez/",
  github: "https://github.com/nottaroisa",
  correo: "isabellanottaro@gmail.com",
  tiktok: "https://www.tiktok.com/@SrtaJeans",
  blog: "https://blogisabellanottaro.blog",
  // Copia del CV de octubre de 2026 sin el teléfono (public/cv-isabella-nottaro.pdf).
  cv: "/cv-isabella-nottaro.pdf",
} as const;

export type Proyecto = {
  id: string;
  nombre: string;
  tipo: string;
  plataforma: "escritorio" | "consola" | "web";
  estado?: string;
  problema: string;
  rol: string;
  stack: string[];
  resultado: string;
  repo?: string;
  demo?: string;
  pendiente?: string;
  vista: VistaPrevia;
};

export type VistaPrevia =
  | { tipo: "arbol"; raiz: string; nodos: { ruta: string; nivel: number }[] }
  | { tipo: "imagenes"; imagenes: { src: string; alt: string }[] };

// Los repositorios fijados en mi perfil de GitHub, en el mismo orden.
export const proyectos: Proyecto[] = [
  {
    id: "portfolio",
    nombre: "Portfolio ASCII",
    tipo: "Web con Next.js y canvas",
    plataforma: "web",
    problema:
      "Una web propia para presentar mis proyectos, mi experiencia y mi contenido que se recuerde: un campo de caracteres en canvas que sigue al ratón y, al hacer scroll, deja mi nombre recortado.",
    rol: "[PENDIENTE: cuenta qué decidiste y qué hiciste tú]",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Canvas 2D", "framer-motion", "Playwright"],
    resultado: "Web estática publicada en Vercel, con modo claro y oscuro y tests de aceptación con Playwright.",
    repo: "https://github.com/nottaroisa/Portfolio",
    demo: "https://isabellanottaro.vercel.app",
    vista: {
      tipo: "arbol",
      raiz: "Portfolio",
      nodos: [
        { ruta: "app", nivel: 0 },
        { ruta: "page.tsx", nivel: 1 },
        { ruta: "proyectos/[id]/page.tsx", nivel: 1 },
        { ruta: "components", nivel: 0 },
        { ruta: "ascii/CampoAscii.tsx", nivel: 1 },
        { ruta: "Hero.tsx", nivel: 1 },
        { ruta: "ListaProyectos.tsx", nivel: 1 },
        { ruta: "TramaImagen.tsx", nivel: 1 },
        { ruta: "e2e", nivel: 0 },
        { ruta: "modo-oscuro.spec.ts", nivel: 1 },
      ],
    },
  },
  {
    id: "entrega-ide",
    nombre: "EntregaIDE",
    tipo: "Modelo de una app de pedidos y reparto",
    plataforma: "consola",
    problema:
      "Modelar en Java un sistema de reparto: clientes, productos por categoría, pedidos con sus líneas y repartidores con estado, para la asignatura de Entornos de Desarrollo.",
    rol: "[PENDIENTE: confirma si lo hiciste tú sola y qué partes destacarías]",
    stack: ["Java", "Eclipse", "Git"],
    resultado: "Entrega con el historial de commits limpio, que refleja el proceso de trabajo real.",
    repo: "https://github.com/nottaroisa/EntregaIDE",
    vista: {
      tipo: "arbol",
      raiz: "EntregaIDE_IFNS/src",
      nodos: [
        { ruta: "clases", nivel: 0 },
        { ruta: "Cliente.java", nivel: 1 },
        { ruta: "Usuario.java", nivel: 1 },
        { ruta: "Producto.java", nivel: 1 },
        { ruta: "Categoria.java", nivel: 1 },
        { ruta: "Pedido.java", nivel: 1 },
        { ruta: "LineaPedido.java", nivel: 1 },
        { ruta: "EstadoPedido.java", nivel: 1 },
        { ruta: "Repartidor.java", nivel: 1 },
        { ruta: "EstadoRepartidor.java", nivel: 1 },
        { ruta: "main", nivel: 0 },
        { ruta: "Main.java", nivel: 1 },
      ],
    },
  },
  {
    id: "pgrid-moodboard",
    nombre: "Moodboard SrtaJeans",
    tipo: "Web con CSS Grid",
    plataforma: "web",
    problema:
      "Una tarjeta de presentación web que resume quién soy (intereses, equipo de grabación y proyectos) maquetada con CSS Grid y áreas con nombre.",
    rol: "Diseño y maquetación completos.",
    stack: ["HTML5", "CSS Grid", "Flexbox", "Variables CSS", "Nesting"],
    resultado: "Responsive en móvil, tablet y escritorio con media queries; rejilla de 4 columnas en escritorio.",
    repo: "https://github.com/nottaroisa/PGridNottaroIsabella",
    pendiente: "[PENDIENTE: publicarla en GitHub Pages para enlazar la demo]",
    vista: {
      tipo: "imagenes",
      imagenes: [
        { src: "/proyectos/pgrid/imagen-pc.jpg", alt: "Ordenador del setup de grabación, una de las imágenes del moodboard" },
        { src: "/proyectos/pgrid/camara-imagen.jpeg", alt: "Cámara de fotos, una de las imágenes del moodboard" },
      ],
    },
  },
];

export type Entrada = {
  titulo: string;
  lugar: string;
  fechas: string;
  detalle: string;
  pendiente?: boolean;
};

// Experiencia y estudios tomados del CV de octubre de 2026.
// De más reciente a más antigua.
export const experiencia: Entrada[] = [
  {
    titulo: "Creadora de contenido profesional",
    lugar: "Autónoma, en TikTok @SrtaJeans",
    fechas: "2020 – actualidad",
    detalle:
      "Colaboraciones profesionales con Xiaomi, Huawei, Telefónica, PcComponentes, Hyte, AliExpress, Temu y Lewitt. Gestiono de forma autónoma cada proyecto de contenido: planificación, guion, producción y publicación.",
  },
  {
    titulo: "Ayudante de cocina",
    lugar: "100 Montaditos",
    fechas: "Agosto – septiembre de 2025",
    detalle: "Trabajo en equipo en un entorno de mucho volumen, manteniendo el orden y la organización.",
  },
];

// Actuales primero.
export const estudios: Entrada[] = [
  {
    titulo: "CFGS Desarrollo de Aplicaciones Multiplataforma",
    lugar: "CPR Liceo La Paz",
    fechas: "2025 – 2027 (cursando 2º)",
    detalle:
      "Java y programación orientada a objetos, multihilo y sockets; MySQL, modelo entidad-relación, ORM y NoSQL; interfaces gráficas y apps móviles; Git, UML y sistemas de gestión empresarial (ERP/CRM).",
  },
  {
    titulo: "Formación complementaria",
    lugar: "Formación propia",
    fechas: "[PENDIENTE: fechas y centros]",
    detalle: "WordPress, IA generativa y transformación digital.",
  },
  {
    titulo: "Inglés B2",
    lugar: "Trinity College London",
    fechas: "[PENDIENTE: año]",
    detalle: "Certificado de nivel B2.",
  },
  {
    titulo: "[PENDIENTE: estudios previos (ESO, Bachillerato…): el CV no los incluye]",
    lugar: "[PENDIENTE: centro]",
    fechas: "[PENDIENTE: fechas]",
    detalle: "",
    pendiente: true,
  },
];

export type Video = {
  id: string;
  titulo: string;
  vistas: string;
  /** TikTok no deja reproducirlo fuera de su web (su servidor de vídeo lo deniega): se abre allí. */
  soloEnTikTok?: boolean;
};

// Mi cuenta de TikTok. Las cifras son las públicas del perfil en la fecha indicada.
export const contenido = {
  usuario: "@srtajeans",
  desde: 2020,
  fecha: "octubre de 2026",
  seguidores: "137,4 mil",
  meGusta: "3,4 M",
  videosPublicados: "240",
  resumen:
    "Hago vídeos de tecnología: móviles, tablets, periféricos y trucos para el ordenador. Busco el tema, escribo el guion, lo produzco y lo publico yo, de principio a fin.",
  marcas: ["Xiaomi", "Huawei", "Telefónica", "PcComponentes", "Hyte", "AliExpress", "Temu", "Lewitt"],
  // Los más vistos de los 45 que el perfil público deja ver sin iniciar sesión, y el del PC pecera.
  videos: [
    { id: "7021965904724495621", titulo: "Los interruptores Blue de un teclado mecánico", vistas: "3,5 M", soloEnTikTok: true },
    { id: "7610354376309345558", titulo: "El Xiaomi Ultra más fino de la historia", vistas: "3,5 M" },
    { id: "7611105353064779010", titulo: "Xiaomi Pad 8 Pro: no extraño mi portátil", vistas: "1,4 M" },
    { id: "7142590131092999430", titulo: "Un PC «pecera» con refrigeración líquida", vistas: "647,1 mil" },
  ] satisfies Video[] as Video[],
};

export const urlDeVideo = (v: Video) => `https://www.tiktok.com/${contenido.usuario}/video/${v.id}`;

// Comunidades en las que participo fuera del aula.
export const comunidades = [
  {
    nombre: "WordPress",
    papel: "Participante activa",
    detalle:
      "He participado en eventos de la comunidad: la WordCamp y diferentes meetups. También colaboro con traducciones y contribuciones, y mi blog está hecho con WordPress.",
    enlaces: [
      { texto: "wpcoruña.com", url: "https://xn--wpcorua-9za.com/es/" },
      { texto: "Leer mi blog", url: enlaces.blog },
    ],
  },
  {
    nombre: "GPUL",
    papel: "Participante activa",
    detalle: "He participado en charlas de GPUL, el Grupo de Programadores e Usuarios de Linux, que promueve el software libre en A Coruña.",
    enlaces: [{ texto: "gpul.org", url: "https://gpul.org/" }],
  },
];

