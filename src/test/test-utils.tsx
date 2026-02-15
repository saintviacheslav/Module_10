import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeProvider";
import { AuthProvider } from "../context/AuthProvider";
import { ToastProvider } from "../context/ToastProvider";

interface AllProvidersProps {
  children: React.ReactNode;
  routerProps?: MemoryRouterProps;
}

function AllProviders({ children, routerProps = {} }: AllProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter {...routerProps}>{children}</MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  routerProps?: MemoryRouterProps;
}

function customRender(
  ui: ReactElement,
  { routerProps, ...renderOptions }: CustomRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AllProviders routerProps={routerProps}>{children}</AllProviders>
    );
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";
export { customRender as render };
