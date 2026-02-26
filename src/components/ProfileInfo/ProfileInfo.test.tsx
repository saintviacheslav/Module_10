/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileInfo from "./ProfileInfo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";

const mockAddToast = jest.fn();

jest.mock("../../context/ToastProvider", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

let mockTheme = "light";

jest.mock("../../context/ThemeProvider", () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

const mockUpdateUser = jest.fn();
const mockLogout = jest.fn();

jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({
    user: { id: 1, username: "john", email: "john@example.com" },
    updateUser: mockUpdateUser,
    logout: mockLogout,
  }),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../lib/api/axios", () => ({
  api: {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock("../Icon/Icon", () => ({
  Icon: ({ name }: any) => {
    const React = require("react");
    return React.createElement("span", { "data-testid": `icon-${name}` });
  },
}));

jest.mock("../ThemeSwitcher/ThemeSwitcher", () => {
  return function MockThemeSwitcher() {
    return null;
  };
});

jest.mock("../LanguageSwitcher/LanguageSwitcher", () => {
  return function MockLanguageSwitcher() {
    return null;
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("ProfileInfo Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        username: "john",
        email: "john@example.com",
        description: "Hello",
      },
    });
  });

  it("renders profile inputs", async () => {
    render(<ProfileInfo />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("john")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("john@example.com"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("profile.writeDescriptionPlaceholder"),
      ).toBeInTheDocument();
    });
  });

  it("calls logout on logout button click", async () => {
    render(<ProfileInfo />, { wrapper: createWrapper() });

    await waitFor(() => {
      const logoutBtn = screen.getByText("common.logout");
      fireEvent.click(logoutBtn);
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it("submits the form with changes", async () => {
    (api.put as jest.Mock).mockResolvedValue({ data: { username: "@john2" } });

    render(<ProfileInfo />, { wrapper: createWrapper() });

    const usernameInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(usernameInput, { target: { value: "@john2" } });

    const saveButton = screen.getByText("profile.saveProfileChanges");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/api/profile", {
        username: "@john2",
      });
      expect(mockAddToast).toHaveBeenCalledWith("profile.profileUpdated", {
        type: "success",
      });
      expect(mockUpdateUser).toHaveBeenCalledWith({ username: "@john2" });
    });
  });

  it("handles image selection and upload", async () => {
    URL.createObjectURL = jest.fn().mockReturnValue("blob:test");
    URL.revokeObjectURL = jest.fn();
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { url: "uploaded_url.png" },
    });
    (api.put as jest.Mock).mockResolvedValueOnce({
      data: { profileImage: "uploaded_url.png" },
    });

    render(<ProfileInfo />, { wrapper: createWrapper() });

    const fileInput = screen.getByAltText("avatar")
      .nextElementSibling as HTMLInputElement;
    const validFile = new File(["dummy content"], "avatar.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.getByAltText("avatar")).toBeInTheDocument();

    const saveButton = screen.getByText("profile.saveProfileChanges");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/upload-image",
        expect.any(FormData),
      );
      expect(api.put).toHaveBeenCalledWith("/api/profile", {
        profileImage: "uploaded_url.png",
      });
    });
  });

  it("shows error for invalid file type", async () => {
    render(<ProfileInfo />, { wrapper: createWrapper() });

    const fileInput = screen.getByAltText("avatar")
      .nextElementSibling as HTMLInputElement;
    const invalidFile = new File(["dummy content"], "avatar.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(mockAddToast).toHaveBeenCalledWith("profile.invalidAvatarType", {
      type: "error",
    });
  });

  it("shows error for file too large", async () => {
    render(<ProfileInfo />, { wrapper: createWrapper() });

    const fileInput = screen.getByAltText("avatar")
      .nextElementSibling as HTMLInputElement;
    const largeFile = new File(["dummy content"], "avatar.png", {
      type: "image/png",
    });
    Object.defineProperty(largeFile, "size", { value: 11 * 1024 * 1024 });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(mockAddToast).toHaveBeenCalledWith("profile.fileTooLarge", {
      type: "error",
    });
  });

  it("validates form fields before submitting", async () => {
    render(<ProfileInfo />, { wrapper: createWrapper() });

    const usernameInput = screen.getAllByRole("textbox")[0];
    const emailInput = screen.getAllByRole("textbox")[1];
    const descInput = screen.getAllByRole("textbox")[2];

    fireEvent.change(usernameInput, { target: { value: "invalid username" } });
    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.change(descInput, { target: { value: "a".repeat(200) } });

    const saveButton = screen.getByText("profile.saveProfileChanges");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.put).not.toHaveBeenCalled();
    });
  });

  it("handles profile update error", async () => {
    (api.put as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<ProfileInfo />, { wrapper: createWrapper() });

    const usernameInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(usernameInput, { target: { value: "@validuser" } });

    const saveButton = screen.getByText("profile.saveProfileChanges");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("Network Error", {
        type: "error",
      });
    });
  });
});
