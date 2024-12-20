import * as React from "react";
import { Outlet } from "@tanstack/react-router";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/common/components/ui/sonner";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

interface MyRouterContext {
  isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: () => <div>Not Found</div>,
  component: () => (
    <React.Fragment>
      <Outlet />

      <Toaster />

      <React.Suspense>
        <TanStackRouterDevtools position="bottom-left" />
      </React.Suspense>
    </React.Fragment>
  ),
});
