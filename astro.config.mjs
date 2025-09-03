import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://docs.astro.build/en/guides/configuring-astro/
export default defineConfig({
  integrations: [react(), tailwind()],
});
