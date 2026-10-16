import type { NextConfig } from "next";

// Web estática: `npm run build` genera la carpeta `out/`, que se puede
// desplegar en Vercel o entregar comprimida en .zip.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
