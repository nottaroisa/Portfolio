import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Space_Mono } from "next/font/google";
import { BotonTema } from "@/components/BotonTema";
import { Movimiento } from "@/components/Movimiento";
import { scriptTema } from "@/lib/tema";
import "./globals.css";

// Dos tintas, dos voces: la serif para lo que se lee como titular y la
// monoespaciada para todo lo que está hecho de caracteres (el ASCII y el texto).
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Isabella Nottaro Sánchez · Desarrollo de aplicaciones",
  description:
    "Portfolio de Isabella Nottaro Sánchez, estudiante de 2º de DAM: proyectos, experiencia, estudios y contacto.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1347" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script del tema añade data-tema antes de hidratar.
    <html lang="es" className={`${instrument.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <BotonTema />
        <Movimiento>{children}</Movimiento>
      </body>
    </html>
  );
}
