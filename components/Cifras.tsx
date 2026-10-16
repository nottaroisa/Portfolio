import { Fragment } from "react";

// En la serif, el "1" se confunde con una "l" (RpgDam1 parece "RpgDaml").
// Las cifras de los nombres van en la monoespaciada, como el código.
export function Cifras({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\d+)/g).map((parte, i) =>
        /^\d+$/.test(parte) ? (
          <span key={i} className="font-mono text-[0.78em] tracking-tight">
            {parte}
          </span>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}
