import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

jest.mock("../Header/Header", () => () => <header data-testid="mock-header">Header</header>);
jest.mock("../Footer/Footer", () => () => <footer data-testid="mock-footer">Footer</footer>);

function renderLayoutAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<span>Main page</span>} />
      </Route>
      <Route path="/signin/" element={<Layout />}>
        <Route index element={<span>SignIn page</span>} />
      </Route>
      <Route path="/signup/" element={<Layout />}>
        <Route index element={<span>SignUp page</span>} />
      </Route>
      <Route path="/profile" element={<Layout />}>
        <Route index element={<span>Profile</span>} />
      </Route>
      <Route path="/profile/info" element={<Layout />}>
        <Route index element={<span>Profile info</span>} />
      </Route>
      <Route path="/unknown" element={<Layout />}>
        <Route index element={<span>NotFound</span>} />
      </Route>
    </Routes>
    </MemoryRouter>,
  );
}

describe("Layout", () => {
  it("renders Header, main and Footer", () => {
    renderLayoutAt("/");
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("layout-main")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("applies centered class to main on signin path", () => {
    renderLayoutAt("/signin/");
    const main = screen.getByTestId("layout-main");
    expect(main.className).toMatch(/centered/);
  });

  it("applies centered class to main on signup path", () => {
    renderLayoutAt("/signup/");
    const main = screen.getByTestId("layout-main");
    expect(main.className).toMatch(/centered/);
  });

  it("does not apply centered class to main on home path", () => {
    renderLayoutAt("/");
    const main = screen.getByTestId("layout-main");
    expect(main.className).not.toMatch(/centered/);
  });

  it("does not apply centered class to main on profile path", () => {
    renderLayoutAt("/profile");
    const main = screen.getByTestId("layout-main");
    expect(main.className).not.toMatch(/centered/);
  });

  it("does not apply centered class to main on profile/info path", () => {
    renderLayoutAt("/profile/info");
    const main = screen.getByTestId("layout-main");
    expect(main.className).not.toMatch(/centered/);
  });

  it("applies centered class to main on unknown (e.g. NotFound) path", () => {
    renderLayoutAt("/unknown");
    const main = screen.getByTestId("layout-main");
    expect(main.className).toMatch(/centered/);
  });

  it("renders Outlet content", () => {
    renderLayoutAt("/");
    expect(screen.getByText("Main page")).toBeInTheDocument();
    renderLayoutAt("/signin/");
    expect(screen.getByText("SignIn page")).toBeInTheDocument();
  });
});
