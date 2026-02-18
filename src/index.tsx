import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ToastProvider } from "./context/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { startMockingSocial } from "@sidekick-monorepo/internship-backend";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    },
  },
});

async function enableMocking() {
  await startMockingSocial("/Module_10");
}

enableMocking()
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error("Can't load mocks:", err);
  });