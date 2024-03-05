import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    server: {
      host: "0.0.0.0",
      port: "3000",
      strictPort: true,
    },
    plugins: [react()],
  });
};
