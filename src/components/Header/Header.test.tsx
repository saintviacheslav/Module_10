import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/" }),
}));

let mockIsAuthenticated = false;
let mockUser = { firstName: "Test", secondName: "User", profileImage: "" };

jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    user: mockUser,
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "common.signUp": "Sign Up",
        "common.signIn": "Sign In",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../../components/Icon/Icon", () => ({
  Icon: ({ name, onClick }: { name: string; onClick?: () => void }) => (
    <span data-testid={`icon-${name}`} onClick={onClick} />
  ),
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = false;
  });

  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
  };

  it("renders the logo and navigates to home on click", () => {
    renderHeader();
    const logo = screen.getByTestId("icon-logo");
    expect(logo).toBeInTheDocument();

    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows Sign In and Sign Up when not authenticated", () => {
    renderHeader();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("navigates to signup and signin on click", () => {
    renderHeader();
    fireEvent.click(screen.getByText("Sign Up"));
    expect(mockNavigate).toHaveBeenCalledWith("/signup");

    fireEvent.click(screen.getByText("Sign In"));
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  it("shows user info when authenticated", () => {
    mockIsAuthenticated = true;
    renderHeader();

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
  });

  it("navigates to profile when clicking on avatar or name", () => {
    mockIsAuthenticated = true;
    renderHeader();

    fireEvent.click(screen.getByText("Test User"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile");

    const avatar = screen.getByAltText("avatar");
    fireEvent.click(avatar);
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("toggles the side menu when burger icon is clicked", () => {
    renderHeader();

    const burgerMenu = screen.getByTestId("icon-burger-menu");
    fireEvent.click(burgerMenu);
  });
});
