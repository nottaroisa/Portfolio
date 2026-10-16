import { Fragment } from "react";

// Resalta los marcadores [PENDIENTE: ...] para que se vean a simple vista.
export function Texto({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\[PENDIENTE:[^\]]*\])/g).map((parte, i) =>
        parte.startsWith("[PENDIENTE:") ? (
          <span key={i} className="pendiente">
            {parte}
          </span>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}
