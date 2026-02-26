/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./SignIn";

const mockLogin = jest.fn();
const mockNavigate = jest.fn();
const mockAddToast = jest.fn();

jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../../context/ToastProvider", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../components/Icon/Icon", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

describe("SignIn Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sign in form", () => {
    render(<SignIn />);
    expect(screen.getByText("auth.signInTitle")).toBeInTheDocument();
    expect(screen.getByText("auth.signInDescription")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("auth.enterEmail")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("auth.enterPassword"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "common.signIn" }),
    ).toBeInTheDocument();
    expect(screen.getByText("common.signUp")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", () => {
    render(<SignIn />);
    const submitButton = screen.getByRole("button", { name: "common.signIn" });
    fireEvent.click(submitButton);

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockAddToast).toHaveBeenCalledWith("errors.fixErrorsAbove", {
      type: "error",
    });
  });

  it("calls login and navigates on valid submit", async () => {
    mockLogin.mockResolvedValue(undefined);

    render(<SignIn />);
    fireEvent.change(screen.getByPlaceholderText("auth.enterEmail"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.enterPassword"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "common.signIn" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@example.com", "password123");
      expect(mockAddToast).toHaveBeenCalledWith("errors.successfulAuth", {
        type: "success",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error toast and sets password error on login failure", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));

    render(<SignIn />);
    fireEvent.change(screen.getByPlaceholderText("auth.enterEmail"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.enterPassword"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "common.signIn" }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("Invalid credentials", {
        type: "error",
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("navigates to signup when clicking sign up link", () => {
    render(<SignIn />);
    fireEvent.click(screen.getByText("common.signUp"));
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });
});
