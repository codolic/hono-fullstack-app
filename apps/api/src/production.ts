import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { serveStatic } from "@hono/node-server/serve-static"

import { app } from "./app"

const apiRoutes = app

const webDistPath =
  process.env.WEB_DIST_PATH ??
  fileURLToPath(new URL("../../web/dist", import.meta.url))
const indexHtmlPath = join(webDistPath, "index.html")

apiRoutes.use(
  "/assets/*",
  serveStatic({
    root: webDistPath,
    onFound: (_path, c) => {
      c.header("Cache-Control", "public, max-age=31536000, immutable")
    },
  }),
)

apiRoutes.get(
  "/favicon.ico",
  serveStatic({
    path: join(webDistPath, "favicon.ico"),
  }),
)

apiRoutes.get("*", async (c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ message: "Not found" }, 404)
  }

  return c.html(await readFile(indexHtmlPath, "utf8"))
})

export { apiRoutes as app }
