import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "node:process";

/**
 * Social previews need absolute URLs. Use SITE_URL when set, otherwise the production domain
 * Vercel exposes at build time, otherwise leave the links relative.
 */
function siteUrl(): Plugin {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url = (process.env.SITE_URL ?? (vercel ? `https://${vercel}` : "")).replace(/\/$/, "");
  return {
    name: "site-url",
    transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", url),
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
});
