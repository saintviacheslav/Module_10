import { render, screen, fireEvent } from "@testing-library/react";
import ThemeSwitcher from "./ThemeSwitcher";

const mockToggleTheme = jest.fn();
let mockTheme = "light";

jest.mock("../../context/ThemeProvider", () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme,
  }),
  Theme: { DARK: "dark", LIGHT: "light" },
}));

describe("ThemeSwitcher Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTheme = "light";
  });

  it("renders the theme switcher button", () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls toggleTheme on click", () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  it("applies dark classes when theme is dark", () => {
    mockTheme = "dark";
    render(<ThemeSwitcher />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("dark");
  });
});
