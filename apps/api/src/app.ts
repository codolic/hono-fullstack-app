import { cors } from "hono/cors"
import { Hono } from "hono"

import { GreetingResponseSchema, HealthResponseSchema } from "@acme/shared"

export const app = new Hono()

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173"],
  }),
)

app.get("/api", (c) => {
  return c.json({ message: "Hono API is running" })
})

app.get("/api/health", (c) => {
  const response = HealthResponseSchema.parse({
    status: "ok",
    service: "api",
    timestamp: new Date().toISOString(),
  })

  return c.json(response)
})

app.get("/api/greeting", (c) => {
  const name = c.req.query("name")?.trim() || "there"
  const result = GreetingResponseSchema.safeParse({
    message: `Hello, ${name}.`,
  })

  if (!result.success) {
    return c.json({ message: "Invalid greeting response" }, 500)
  }

  return c.json(result.data)
})
