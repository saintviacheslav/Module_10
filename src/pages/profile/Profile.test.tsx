import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "./Profile";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/profile/info" }),
    Outlet: () => <div data-testid="outlet" />,
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders segmented controls and navigates on click", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.getByText("common.profileInfo")).toBeInTheDocument();
    expect(screen.getByText("common.statistics")).toBeInTheDocument();

    fireEvent.click(screen.getByText("common.statistics"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile/statistics");

    fireEvent.click(screen.getByText("common.profileInfo"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile/info");
  });
});
