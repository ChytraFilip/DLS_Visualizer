import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/DLS_Visualizer/", // Replace 'your-repo-name' with your actual repository name
  build: {
    outDir: "dist",
  },
  optimizeDeps: {
    include: ["plotly.js-basic-dist"], // Add any other Plotly packages you need
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
