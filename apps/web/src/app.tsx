import { useQuery } from "@tanstack/react-query"
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Container,
  Network,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"
import { Button } from "@acme/ui/button"
import { HealthResponseSchema, type HealthResponse } from "@acme/shared"

async function getHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/health")

  if (!response.ok) {
    throw new Error(`API responded with ${response.status}`)
  }

  return HealthResponseSchema.parse(await response.json())
}

export function HomePage() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  })

  const statusLabel = healthQuery.data ? "Online" : healthQuery.isPending ? "Checking" : "Degraded"

  return (
    <main className="app-shell min-h-screen overflow-hidden text-white">
      <section className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-8 overflow-hidden px-5 py-6 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]" />

        <div className="hero-panel relative flex min-h-[620px] flex-col justify-between overflow-hidden rounded-lg border border-white/12 px-6 py-7 sm:px-8 lg:px-10">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="brand-mark">
                <Zap className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-200/80">Fullstack Runtime</p>
                <p className="text-sm text-slate-300">One codebase. One production port.</p>
              </div>
            </div>
            <div className="hidden rounded-full border border-white/15 bg-white/8 px-4 py-2 font-mono text-xs text-slate-200 sm:block">
              pnpm workspace
            </div>
          </div>

          <div className="relative z-10 max-w-3xl py-12 lg:py-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.24em] text-cyan-100">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Vite + Hono starter
            </div>
            <h1 className="hero-title text-6xl font-semibold leading-[0.9] tracking-normal text-white sm:text-7xl lg:text-8xl">
              Ship a sharp fullstack surface.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              A production-ready React and Hono workspace with shared Zod contracts, TanStack Query data flow,
              shadcn-style components, and a Docker path that serves app and API together.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="h-11 rounded-md bg-cyan-300 px-5 text-slate-950 shadow-[0_0_30px_rgba(103,232,249,0.25)] hover:bg-cyan-200"
                onClick={() => void healthQuery.refetch()}
                disabled={healthQuery.isFetching}
              >
                <RefreshCw className={healthQuery.isFetching ? "animate-spin" : ""} aria-hidden="true" />
                Refresh API
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-md border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
              >
                <Container className="size-4" aria-hidden="true" />
                Docker ready
              </Button>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["web", "Vite React"],
              ["api", "Hono Node"],
              ["types", "Zod shared"],
              ["deploy", "Docker"],
            ].map(([label, value]) => (
              <div key={label} className="metric-tile">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-medium text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid gap-5 lg:grid-rows-[auto_1fr_auto]">
          <section className="status-module rounded-lg border border-white/12 bg-slate-950/75 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-slate-400">Live API</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{statusLabel}</h2>
              </div>
              <div className={`status-light ${healthQuery.data ? "is-online" : ""}`} aria-hidden="true" />
            </div>

            <div className="mt-6 rounded-md border border-white/10 bg-black/40 p-4 font-mono text-xs text-cyan-50">
              {healthQuery.isPending ? <p>await fetch("/api/health")</p> : null}
              {healthQuery.error ? <p>{healthQuery.error.message}</p> : null}
              {healthQuery.data ? <pre className="overflow-auto">{JSON.stringify(healthQuery.data, null, 2)}</pre> : null}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Network,
                title: "Same route model",
                copy: "Development proxies /api through Vite. Production serves /api and the SPA from Hono.",
              },
              {
                icon: ShieldCheck,
                title: "Typed boundary",
                copy: "Shared Zod schemas validate server responses before React renders them.",
              },
              {
                icon: Boxes,
                title: "Workspace shape",
                copy: "apps/web, apps/api, packages/shared, and packages/ui stay cleanly separated.",
              },
              {
                icon: ArrowUpRight,
                title: "Deploy path",
                copy: "The Docker image builds the monorepo and starts the single production server.",
              },
            ].map((item) => (
              <article key={item.title} className="feature-card rounded-lg border border-white/10 bg-white/[0.055] p-5">
                <item.icon className="size-5 text-cyan-200" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.copy}</p>
              </article>
            ))}
          </section>

          <section className="deploy-strip rounded-lg border border-cyan-200/20 bg-cyan-200/10 p-5">
            <div className="flex items-center gap-3">
              <Activity className="size-5 text-cyan-100" aria-hidden="true" />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-100/80">Production command</p>
                <p className="mt-1 font-mono text-sm text-white">docker compose up --build</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export function StatusPage() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  })

  return (
    <main className="app-shell min-h-screen px-5 py-24 text-white sm:px-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-white/12 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
        <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-100/80">Route example</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal">/status</h1>
        <p className="mt-4 text-slate-300">
          This page is rendered by TanStack Router and reads the same cached TanStack Query health endpoint as the
          home page.
        </p>

        <div className="mt-6 rounded-md border border-white/10 bg-black/40 p-4 font-mono text-xs text-cyan-50">
          {healthQuery.isPending ? <p>Loading health check...</p> : null}
          {healthQuery.error ? <p>{healthQuery.error.message}</p> : null}
          {healthQuery.data ? <pre className="overflow-auto">{JSON.stringify(healthQuery.data, null, 2)}</pre> : null}
        </div>
      </section>
    </main>
  )
}
