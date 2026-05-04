// @ts-check
import { defineConfig } from "astro/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  server: {
    headers: {
      // Optional: Add security headers
    },
  },
  vite: {
    resolve: {
      alias: {
        "../questions": path.resolve(__dirname, "./src/questions"),
      },
    },
  },
  build: {
    // Exclude the questions directory from route generation
    ignore: ["src/questions/**/*"],
  },
});
