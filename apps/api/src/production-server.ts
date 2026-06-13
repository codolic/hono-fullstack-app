import { serve } from "@hono/node-server"

import { app } from "./production"

const port = Number(process.env.PORT ?? 3000)

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Production server listening on http://localhost:${info.port}`)
  },
)
