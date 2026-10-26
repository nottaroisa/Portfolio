"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { IconoCertificado, IconoCorreo, IconoCredencial, IconoDescargar, IconoGitHub, IconoVolver, useVezAlPasar } from "./IconosAnimados";

const iconos = {
  correo: IconoCorreo,
  descargar: IconoDescargar,
  volver: IconoVolver,
  github: IconoGitHub,
  certificado: IconoCertificado,
  credencial: IconoCredencial,
};

// Enlace con un icono animado delante del texto: el icono se mueve al pasar el
// ratón por cualquier parte del enlace o al llegar a él con el teclado. `antes`
// va delante del icono (la miniatura de un certificado, por ejemplo). Las
// páginas de la web van con <Link> de Next; los ficheros y lo de fuera, con <a>.
export function EnlaceConIcono({
  icono,
  antes,
  children,
  className,
  href,
  ...enlace
}: AnchorHTMLAttributes<HTMLAnchorElement> & { icono: keyof typeof iconos; antes?: ReactNode; children: ReactNode; href: string }) {
  const { vez, alPasar } = useVezAlPasar();
  const Icono = iconos[icono];
  const clases = `inline-flex items-center gap-2 ${className ?? ""}`;
  const contenido = (
    <>
      {antes}
      <Icono vez={vez} />
      {children}
    </>
  );
  const pagina = href.startsWith("/") && !/\.\w+$/.test(href);

  return pagina ? (
    <Link href={href} {...enlace} {...alPasar} className={clases}>
      {contenido}
    </Link>
  ) : (
    <a href={href} {...enlace} {...alPasar} className={clases}>
      {contenido}
    </a>
  );
}
