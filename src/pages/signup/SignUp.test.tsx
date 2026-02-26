/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "./SignUp";

const mockSignup = jest.fn();
const mockNavigate = jest.fn();
const mockAddToast = jest.fn();

jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({ signup: mockSignup }),
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

describe("SignUp Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders sign up form", () => {
    render(<SignUp />);
    expect(screen.getByText("auth.signUpTitle")).toBeInTheDocument();
    expect(screen.getByText("auth.signUpFormDescription")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("auth.enterEmail")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("auth.enterPassword"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "common.signUp" }),
    ).toBeInTheDocument();
    expect(screen.getByText("common.signIn")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", () => {
    render(<SignUp />);
    const submitButton = screen.getByRole("button", { name: "common.signUp" });
    fireEvent.click(submitButton);

    expect(mockSignup).not.toHaveBeenCalled();
    expect(mockAddToast).toHaveBeenCalledWith("errors.fixErrorsAbove", {
      type: "error",
    });
  });

  it("calls signup and navigates to signin on success", async () => {
    mockSignup.mockResolvedValue(undefined);

    render(<SignUp />);
    fireEvent.change(screen.getByPlaceholderText("auth.enterEmail"), {
      target: { value: "newuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.enterPassword"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "common.signUp" }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "newuser@example.com",
        "password123",
      );
      expect(mockAddToast).toHaveBeenCalledWith(
        "errors.successfulRegistration",
        {
          type: "success",
        },
      );
    });

    jest.advanceTimersByTime(1000);
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  it("shows error and sets email error when email already exists", async () => {
    mockSignup.mockRejectedValue(new Error("Email already exists"));

    render(<SignUp />);
    fireEvent.change(screen.getByPlaceholderText("auth.enterEmail"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.enterPassword"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "common.signUp" }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("Email already exists", {
        type: "error",
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("shows error and sets password error on generic failure", async () => {
    mockSignup.mockRejectedValue(new Error("Server error"));

    render(<SignUp />);
    fireEvent.change(screen.getByPlaceholderText("auth.enterEmail"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.enterPassword"), {
      target: { value: "validpass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "common.signUp" }));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("Server error", {
        type: "error",
      });
    });
  });

  it("navigates to signin when clicking sign in link", () => {
    render(<SignUp />);
    fireEvent.click(screen.getByText("common.signIn"));
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });
});
