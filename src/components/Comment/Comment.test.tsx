/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Comment from "./Comment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";

const mockAddToast = jest.fn();
const mockUseAuth = jest.fn();

jest.mock("../../context/ToastProvider", () => ({
  useToast: () => ({
    addToast: mockAddToast,
  }),
}));

jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "comment.addComment": "Add Comment",
        "comment.writeCommentPlaceholder": "Write a comment...",
        "comment.sending": "Sending...",
        "comment.commentEmpty": "Comment cannot be empty",
        "comment.loginRequired": "Please login to comment",
        "comment.commentAdded": "Comment added successfully",
        "comment.commentError": "Failed to add comment",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../Icon/Icon", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

jest.mock("../Button/Button", () => {
  return function MockButton({
    onClick,
    name,
    disabled,
  }: {
    onClick: () => void;
    name: string;
    disabled?: boolean;
  }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        data-testid="comment-button"
      >
        {name}
      </button>
    );
  };
});

jest.mock("../DescriptionTextArea/DescriptionTextArea", () => {
  return function MockDescriptionTextarea({
    value,
    onChange,
    maxLength,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    maxLength: number;
    placeholder: string;
  }) {
    return (
      <textarea
        data-testid="comment-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
      />
    );
  };
});

jest.mock("../../lib/api/axios", () => ({
  api: {
    post: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Comment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 1, username: "testuser" },
    });
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      expect(screen.getByTestId("comment-textarea")).toBeInTheDocument();
    });

    it("renders the pencil icon", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      expect(screen.getByTestId("icon-pencil")).toBeInTheDocument();
    });

    it("renders the add comment button", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      expect(screen.getByTestId("comment-button")).toBeInTheDocument();
      expect(screen.getByTestId("comment-button")).toHaveTextContent(
        "Add Comment",
      );
    });

    it("renders the textarea with correct placeholder", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      expect(textarea).toHaveAttribute("placeholder", "Write a comment...");
    });

    it("renders button as disabled initially when textarea is empty", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      expect(screen.getByTestId("comment-button")).toBeDisabled();
    });
  });

  describe("Textarea Interaction", () => {
    it("allows typing in the textarea", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");

      fireEvent.change(textarea, { target: { value: "Test comment" } });

      expect(textarea).toHaveValue("Test comment");
    });

    it("enables button when textarea has text", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "Test comment" } });

      expect(button).not.toBeDisabled();
    });

    it("keeps button disabled with only whitespace", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "   " } });

      expect(button).toBeDisabled();
    });

    it("respects maxLength of 200 characters", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");

      expect(textarea).toHaveAttribute("maxLength", "200");
    });

    it("allows text up to 200 characters", () => {
      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const longText = "a".repeat(200);

      fireEvent.change(textarea, { target: { value: longText } });

      expect(textarea).toHaveValue(longText);
    });
  });

  describe("Comment Submission", () => {
    it("calls API when submitting valid comment", async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          text: "Test comment",
          authorId: 1,
          postId: 1,
          creationDate: new Date().toISOString(),
        },
      });
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "Test comment" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith("/api/comments", {
          postId: 1,
          text: "Test comment",
        });
      });
    });

    it("trims whitespace before submitting", async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          text: "Test comment",
          authorId: 1,
          postId: 1,
          creationDate: new Date().toISOString(),
        },
      });
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "  Test comment  " } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith("/api/comments", {
          postId: 1,
          text: "Test comment",
        });
      });
    });

    it("clears textarea after successful submission", async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          text: "Test comment",
          authorId: 1,
          postId: 1,
          creationDate: new Date().toISOString(),
        },
      });
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "Test comment" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(textarea).toHaveValue("");
      });
    });

    it("shows loading state during submission", async () => {
      let resolvePromise: any;
      const mockPost = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          }),
      );
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "Test" } });

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        expect(button).toHaveTextContent("Sending...");
        expect(button).toBeDisabled();
      });

      await act(async () => {
        resolvePromise({
          data: {
            id: 1,
            text: "Test",
            authorId: 1,
            postId: 1,
            creationDate: new Date().toISOString(),
          },
        });
      });

      await waitFor(() => {
        expect(button).toHaveTextContent("Add Comment");
      });
    });

    it("does not submit when comment is at character limit", async () => {
      const mockPost = jest.fn();
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      const longText = "a".repeat(200);
      fireEvent.change(textarea, { target: { value: longText } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPost).not.toHaveBeenCalled();
      });
    });
  });

  describe("Error Handling", () => {
    it("handles API error gracefully", async () => {
      const mockPost = jest.fn().mockRejectedValue(new Error("Network error"));
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "Test comment" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalled();
      });

      expect(textarea).toHaveValue("Test comment");
    });

    it("prevents submission without user authentication", () => {
      mockUseAuth.mockReturnValue({
        user: null,
      });

      const mockPost = jest.fn();
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "Test comment" } });
      fireEvent.click(button);

      expect(mockPost).not.toHaveBeenCalled();
    });
  });

  describe("Props", () => {
    it("works with different postId values", async () => {
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          text: "Test",
          authorId: 1,
          postId: 42,
          creationDate: new Date().toISOString(),
        },
      });
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={42} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: "Test" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith("/api/comments", {
          postId: 42,
          text: "Test",
        });
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string submission attempt", () => {
      const mockPost = jest.fn();
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const button = screen.getByTestId("comment-button");

      fireEvent.click(button);

      expect(mockPost).not.toHaveBeenCalled();
    });

    it("handles special characters in comment", async () => {
      const specialText = "Test @#$%^&*() comment with 特殊字符";
      const mockPost = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          text: specialText,
          authorId: 1,
          postId: 1,
          creationDate: new Date().toISOString(),
        },
      });
      (api.post as jest.Mock) = mockPost;

      render(<Comment postId={1} />, { wrapper: createWrapper() });
      const textarea = screen.getByTestId("comment-textarea");
      const button = screen.getByTestId("comment-button");

      fireEvent.change(textarea, { target: { value: specialText } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith("/api/comments", {
          postId: 1,
          text: specialText,
        });
      });
    });
  });
});
