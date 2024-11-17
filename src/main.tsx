import "./index.css";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// TODO: Add auth
const useAuth = () => {
  return {
    isAuthenticated: false,
  };
};

// TODO: Add auth provider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const InnerApp = () => {
  const auth = useAuth();
  return (
    <RouterProvider
      router={router}
      context={{ isAuthenticated: auth.isAuthenticated }}
    />
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      staleTime: 10 * (60 * 1000), // 10 mins
      gcTime: 15 * (60 * 1000), // 15 mins
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
