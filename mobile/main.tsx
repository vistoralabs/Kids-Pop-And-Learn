/**
 * Standalone client-only entry used ONLY for the Android (Capacitor) build.
 * The web app keeps using TanStack Start SSR; this bundle is fully offline
 * and ships inside the APK / AAB.
 */
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/styles.css";
import { routeTree } from "../src/routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

const el = document.getElementById("root")!;
createRoot(el).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
