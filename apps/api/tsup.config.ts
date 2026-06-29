import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/server.ts", "src/production-server.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "dist",
  clean: true,
  noExternal: ["@acme/shared", "zod"],
})
