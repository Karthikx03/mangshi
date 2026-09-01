import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  // getRouter() runs separately on the server (per request) and on the client (once, at
  // boot), each creating its own fresh QueryClient — nothing shares data between them by
  // default. Route loaders like /system and /seasons call queryClient.ensureQueryData(...)
  // during SSR, so the server-rendered HTML has real data, but without this, the client's
  // QueryClient would start empty: the first client render would have no data where the
  // server had real numbers/lists (a hydration mismatch), and every page would then have to
  // silently refetch everything it already had, showing as a blank-then-populate flash on
  // first load. This wires the two QueryClients together through the router's own SSR data
  // stream so the client starts hydrated with exactly what the server already fetched.
  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
