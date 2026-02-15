import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ToastProvider } from "./context/ToastProvider";

function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />, { wrapper: AppWrapper });
  });

  it("renders app shell", () => {
    const { container } = render(<App />, { wrapper: AppWrapper });
    expect(container).toBeInTheDocument();
  });
});
