import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router"

import { HomePage, StatusPage } from "./app"

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/status",
  component: StatusPage,
})

const routeTree = rootRoute.addChildren([indexRoute, statusRoute])

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function RootLayout() {
  return (
    <>
      <nav className="router-nav">
        <Link to="/" className="router-link">
          Home
        </Link>
        <Link to="/status" className="router-link">
          Status
        </Link>
      </nav>
      <Outlet />
    </>
  )
}
