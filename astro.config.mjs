import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import path from "node:path"; // ← IMPORTANTE

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  adapter: vercel(),
  alias: {
    "@": path.resolve("src"),
  },
});
