import { render, screen, fireEvent } from "@testing-library/react";
import SideMenu from "./SideMenu";

const mockNavigate = jest.fn();
let mockIsAuthenticated = false;

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    user: { profileImage: "avatar.png" },
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../components/Icon/Icon", () => ({
  Icon: (props: any) => {
    const React = require("react");
    return React.createElement("span", {
      "data-testid": `icon-${props.name}`,
      onClick: props.onClick,
    });
  },
}));

describe("SideMenu Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = false;
  });

  it("renders nothing if not open", () => {
    const { container } = render(
      <SideMenu isOpen={false} onClose={jest.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders auth links when not authenticated", () => {
    render(<SideMenu isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText("common.signIn")).toBeInTheDocument();
    expect(screen.getByText("common.signUp")).toBeInTheDocument();
  });

  it("renders profile links when authenticated", () => {
    mockIsAuthenticated = true;
    render(<SideMenu isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText("common.profileInfo")).toBeInTheDocument();
    expect(screen.getByText("common.statistics")).toBeInTheDocument();
  });

  it("navigates and closes on link click", () => {
    const handleClose = jest.fn();
    render(<SideMenu isOpen={true} onClose={handleClose} />);

    fireEvent.click(screen.getByText("common.signIn"));
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
    expect(handleClose).toHaveBeenCalled();
    jest.clearAllMocks();

    fireEvent.click(screen.getByText("common.signUp"));
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
    expect(handleClose).toHaveBeenCalled();
  });

  it("navigates and closes on authenticated links click", () => {
    mockIsAuthenticated = true;
    const handleClose = jest.fn();
    render(<SideMenu isOpen={true} onClose={handleClose} />);

    fireEvent.click(screen.getByText("common.profileInfo"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile/info");
    expect(handleClose).toHaveBeenCalled();
    jest.clearAllMocks();

    fireEvent.click(screen.getByText("common.statistics"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile/statistics");
    expect(handleClose).toHaveBeenCalled();
    jest.clearAllMocks();

    fireEvent.click(screen.getByAltText("avatar"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
    expect(handleClose).toHaveBeenCalled();
  });

  it("navigates to home on logo click", () => {
    const handleClose = jest.fn();
    render(<SideMenu isOpen={true} onClose={handleClose} />);

    const logo = screen.getByTestId("icon-logo");
    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(handleClose).toHaveBeenCalled();
  });
});
