// Contenido de la web. Lo marcado con [PENDIENTE: ...] está por completar
// y se muestra resaltado en la página hasta entonces.

export const perfil = {
  nombre: "Isabella Nottaro Sánchez",
  lema: "No entiendo la tecnología sin la creatividad.",
  estudia: "2º DAM en CPR Liceo La Paz",
  stack: ["Java", "MySQL", "HTML", "CSS", "Git"],
  busca: "Prácticas (FCT) de backend o full stack",
  idiomas: "Castellano e inglés B2 (Trinity)",
  comunidad: "WordPress: traducciones, contribuciones y meetups",
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
  plataforma: "escritorio" | "consola" | "web" | "erp";
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
  | { tipo: "modulos"; modulos: string[] }
  | { tipo: "imagenes"; imagenes: { src: string; alt: string }[] };

export const proyectos: Proyecto[] = [
  {
    id: "erp-aromas-del-norte",
    nombre: "ERP para Aromas del Norte",
    tipo: "Implantación de Odoo",
    plataforma: "erp",
    estado: "En curso",
    problema:
      "Una tienda de cosmética artesanal (empresa ficticia, 6 personas) gestiona pedidos en Excel, el stock en un cuaderno y los clientes en la agenda del móvil. Vende productos que ya no tiene y la tienda física y la online no se hablan.",
    rol: "[PENDIENTE: confirma tu rol, p. ej. análisis de requisitos, configuración e importación de datos]",
    stack: ["Odoo", "CRM", "Inventario", "Compras", "TPV", "Importación CSV"],
    resultado: "[PENDIENTE: qué quedó funcionando al terminar]",
    pendiente: "[PENDIENTE: capturas de Odoo y enlace a la memoria o repositorio]",
    vista: {
      tipo: "modulos",
      modulos: [
        "Sitio web",
        "Comercio electrónico",
        "CRM",
        "Inventario",
        "Compras",
        "Punto de venta",
        "Email marketing",
        "Gastos",
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
    id: "rpg-dam1",
    nombre: "RpgDam1",
    tipo: "Juego de rol por consola",
    plataforma: "consola",
    problema:
      "Un RPG por turnos en Java que crece práctica a práctica: personajes con herencia (Guerrero, Mago, Arquero), enemigos, inventario, experiencia y curación, guardado en ficheros y excepciones propias.",
    rol: "[PENDIENTE: el repo es un fork del profesor (ismael-hasan/RpgDam1); explica qué partes implementaste tú]",
    stack: ["Java", "POO y herencia", "Excepciones", "Ficheros", "Tests"],
    resultado: "[PENDIENTE: p. ej. número de tests que pasan o mecánicas que terminaste]",
    repo: "https://github.com/nottaroisa/RpgDam1",
    vista: {
      tipo: "arbol",
      raiz: "RpgDam1/src",
      nodos: [
        { ruta: "jugador", nivel: 0 },
        { ruta: "Personaje.java", nivel: 1 },
        { ruta: "Guerrero.java", nivel: 1 },
        { ruta: "Mago.java", nivel: 1 },
        { ruta: "Arquero.java", nivel: 1 },
        { ruta: "enemigos", nivel: 0 },
        { ruta: "Zombie.java · Espectro.java · Demonio.java", nivel: 1 },
        { ruta: "excepciones", nivel: 0 },
        { ruta: "PersonajeMuertoException.java", nivel: 1 },
        { ruta: "principal", nivel: 0 },
        { ruta: "Juego.java · GestorFicheros.java", nivel: 1 },
        { ruta: "tests", nivel: 0 },
        { ruta: "6 clases de test", nivel: 1 },
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

export const contenido = {
  desde: 2020,
  marcas: ["Xiaomi", "Huawei", "Telefónica", "PcComponentes", "Hyte", "AliExpress", "Temu", "Lewitt"],
  porQueImporta:
    "Planifico, escribo el guion, produzco y publico cada pieza de forma autónoma, organizando el trabajo por etapas y cuidando la calidad, la narrativa y el diseño visual.",
  videos: "[PENDIENTE: enlaces a 2 o 3 vídeos o colaboraciones destacadas]",
};

