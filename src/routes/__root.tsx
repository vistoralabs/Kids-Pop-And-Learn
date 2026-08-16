import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { App } from "@capacitor/app";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { initBackButton } from "../services/backButton";
import { adManager } from "../services/adManager";

function NotFoundComponent() {
  return (
    <div className="page-sky flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-6xl" aria-hidden="true">
          🧩
        </p>
        <h1 className="mt-4 font-display text-3xl text-secondary-foreground">
          Oops! Let&apos;s try again 😊
        </h1>
        <p className="mt-2 text-sm font-bold text-muted-foreground">
          That page is not here. Let&apos;s go back and play.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="tap-scale inline-flex min-h-16 items-center justify-center rounded-3xl bg-primary px-6 py-4 font-display text-xl text-primary-foreground shadow-[0_8px_0_0_rgba(0,0,0,0.15)]"
          >
            🏠 Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="page-sky flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-6xl" aria-hidden="true">
          🎈
        </p>
        <h1 className="mt-4 font-display text-3xl text-secondary-foreground">
          Oops! Let&apos;s try again 😊
        </h1>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="tap-scale inline-flex min-h-16 items-center justify-center rounded-3xl bg-grass px-6 py-4 font-display text-xl text-card shadow-[0_8px_0_0_rgba(0,0,0,0.15)]"
          >
            🔁 Try again
          </button>
          <a
            href="/"
            className="tap-scale inline-flex min-h-16 items-center justify-center rounded-3xl bg-card px-6 py-4 font-display text-xl shadow-[0_8px_0_0_rgba(0,0,0,0.12)]"
          >
            🏠 Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5",
      },
      { title: "Kids Pop & Learn" },
      {
        name: "description",
        content: "A colorful, safe tap-and-learn game for young children. Play • Learn • Smile.",
      },
      { name: "theme-color", content: "#bfe3f5" },
      { property: "og:title", content: "Kids Pop & Learn" },
      {
        property: "og:description",
        content: "A colorful, safe tap-and-learn game for young children.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    // Initialize AdMob Manager
    adManager.initialize();

    initBackButton(() => {
      if (window.location.pathname !== "/" && window.location.pathname !== "") {
        router.navigate({ to: "/" });
      } else {
        try {
          App.exitApp();
        } catch {
          /* web environment */
        }
      }
    });
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
