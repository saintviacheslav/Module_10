/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalPost from "./ModalPost";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";

const mockAddToast = jest.fn();

jest.mock("../../context/ToastProvider", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../lib/api/axios", () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock("../Icon/Icon", () => ({
  Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("ModalPost Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when isOpen is true", () => {
    render(<ModalPost isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText("modalPost.createPost")).toBeInTheDocument();
  });

  it("shows error toast if title is empty", async () => {
    render(<ModalPost isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const createButton = screen.getByText("modalPost.create");
    fireEvent.click(createButton);

    expect(mockAddToast).toHaveBeenCalledWith("modalPost.postTitleEmpty", {
      type: "error",
    });
    expect(api.post).not.toHaveBeenCalled();
  });

  it("shows error if description is empty", () => {
    render(<ModalPost isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const titleInput = screen.getByPlaceholderText(
      "modalPost.postTitlePlaceholder",
    );
    fireEvent.change(titleInput, { target: { value: "Test Title" } });

    const createButton = screen.getByText("modalPost.create");
    fireEvent.click(createButton);

    expect(mockAddToast).toHaveBeenCalledWith("modalPost.descriptionEmpty", {
      type: "error",
    });
  });

  it("shows error if title is too long", () => {
    render(<ModalPost isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const titleInput = screen.getByPlaceholderText(
      "modalPost.postTitlePlaceholder",
    );
    fireEvent.change(titleInput, { target: { value: "a".repeat(50) } });

    const createButton = screen.getByText("modalPost.create");
    fireEvent.click(createButton);

    expect(mockAddToast).toHaveBeenCalledWith("modalPost.titleTooLong", {
      type: "error",
    });
  });

  it("shows error if description is too long", () => {
    render(<ModalPost isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const titleInput = screen.getByPlaceholderText(
      "modalPost.postTitlePlaceholder",
    );
    fireEvent.change(titleInput, { target: { value: "Short title" } });

    const descInput = screen.getByPlaceholderText(
      "profile.writeDescriptionPlaceholder",
    );
    fireEvent.change(descInput, { target: { value: "a".repeat(200) } });

    const createButton = screen.getByText("modalPost.create");
    fireEvent.click(createButton);

    expect(mockAddToast).toHaveBeenCalledWith("modalPost.descriptionTooLong", {
      type: "error",
    });
  });

  it("validates file type and size on drop", () => {
    render(<ModalPost isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const dropZone = screen
      .getByText("modalPost.selectFileOrDrag")
      .closest("div");

    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [new File([""], "test.pdf", { type: "application/pdf" })],
      },
    });
    expect(mockAddToast).toHaveBeenCalledWith("modalPost.invalidFileType", {
      type: "error",
    });

    const largeFile = new File([""], "large.png", { type: "image/png" });
    Object.defineProperty(largeFile, "size", { value: 11 * 1024 * 1024 });
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [largeFile] },
    });
    expect(mockAddToast).toHaveBeenCalledWith("modalPost.fileTooLarge", {
      type: "error",
    });
  });

  it("handles valid image file selection and uploads it", async () => {
    URL.createObjectURL = jest.fn().mockReturnValue("blob:test");
    URL.revokeObjectURL = jest.fn();
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { url: "uploaded_url.png" },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { id: 1, title: "T", content: "D" },
    });

    render(<ModalPost isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const titleInput = screen.getByPlaceholderText(
      "modalPost.postTitlePlaceholder",
    );
    fireEvent.change(titleInput, { target: { value: "Valid Title" } });

    const descInput = screen.getByPlaceholderText(
      "profile.writeDescriptionPlaceholder",
    );
    fireEvent.change(descInput, { target: { value: "Valid Description" } });

    const fileInput = screen
      .getByTestId("icon-file-download")
      .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByAltText("Preview")).toBeInTheDocument();

    const createButton = screen.getByText("modalPost.create");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/upload-image",
        expect.any(FormData),
      );
      expect(api.post).toHaveBeenCalledWith("/api/posts", {
        title: "Valid Title",
        content: "Valid Description",
        image: "uploaded_url.png",
      });
    });
  });

  it("handles API error during post creation", async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<ModalPost isOpen={true} onClose={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const titleInput = screen.getByPlaceholderText(
      "modalPost.postTitlePlaceholder",
    );
    fireEvent.change(titleInput, { target: { value: "T" } });

    const descInput = screen.getByPlaceholderText(
      "profile.writeDescriptionPlaceholder",
    );
    fireEvent.change(descInput, { target: { value: "D" } });

    const createButton = screen.getByText("modalPost.create");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("Network Error", {
        type: "error",
      });
    });
  });

  it("submits the post and closes on success", async () => {
    const mockOnClose = jest.fn();
    (api.post as jest.Mock).mockResolvedValue({
      data: { id: 1, title: "Test", content: "Description" },
    });

    render(<ModalPost isOpen={true} onClose={mockOnClose} />, {
      wrapper: createWrapper(),
    });

    const titleInput = screen.getByPlaceholderText(
      "modalPost.postTitlePlaceholder",
    );
    fireEvent.change(titleInput, { target: { value: "Test Title" } });

    const descInput = screen.getByPlaceholderText(
      "profile.writeDescriptionPlaceholder",
    );
    fireEvent.change(descInput, { target: { value: "Test Description" } });

    const createButton = screen.getByText("modalPost.create");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/posts", {
        title: "Test Title",
        content: "Test Description",
      });
      expect(mockAddToast).toHaveBeenCalledWith("modalPost.postCreated", {
        type: "success",
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
