import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { captureReferralFromUrl } from "@/lib/affiliate-tracking";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-lime">Error 404</p>
        <h1 className="mt-4 font-display text-7xl">Off the map.</h1>
        <p className="mt-4 text-muted-foreground">
          The page you're looking for doesn't exist or was moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-lime px-5 py-2.5 text-sm font-medium text-lime-foreground hover:opacity-90 transition"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Atlas — Startup Infrastructure Marketplace for Investors" },
      { name: "description", content: "Curated deal flow from vetted, revenue-generating infrastructure startups. Built for institutional capital." },
      { property: "og:title", content: "Atlas — Startup Infrastructure Marketplace" },
      { property: "og:description", content: "Curated deal flow for institutional investors. Vetted infrastructure startups." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    captureReferralFromUrl();
  }, []);
  const isApp = pathname.startsWith("/app");
  if (isApp) return <Outlet />;
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
