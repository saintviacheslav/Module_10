import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const mockUseAuth = jest.fn();
jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

function renderProtectedRoute(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<div>Profile content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("redirects to home when not authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });
    renderProtectedRoute("/profile");
    expect(screen.getByText("Home page")).toBeInTheDocument();
    expect(screen.queryByText("Profile content")).not.toBeInTheDocument();
  });

  it("renders outlet (protected content) when authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    renderProtectedRoute("/profile");
    expect(screen.getByText("Profile content")).toBeInTheDocument();
    expect(screen.queryByText("Home page")).not.toBeInTheDocument();
  });
});
