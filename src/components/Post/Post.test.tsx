/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Post from "./Post";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";

const mockAddToast = jest.fn();

jest.mock("../../context/ToastProvider", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

let mockIsAuthenticated = false;
let mockUser = { id: 1 };

jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    user: mockUser,
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === "post.likesCount") {
        return `${options?.count} likes`;
      }
      if (key === "post.commentsCount") {
        return `${options?.count} comments`;
      }
      if (key === "post.loginToComment") {
        return "Login to comment";
      }
      if (key === "post.unknown") {
        return "Unknown User";
      }
      return key;
    },
  }),
}));

jest.mock("../../components/Icon/Icon", () => ({
  Icon: ({ name, onClick }: { name: string; onClick?: () => void }) => (
    <span data-testid={`icon-${name}`} onClick={onClick} />
  ),
}));

jest.mock("../../lib/api/axios", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../../components/Comment/Comment", () => () => (
  <div data-testid="comment-component" />
));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockPostData = {
  id: 1,
  title: "Test Post",
  content: "This is a test post.",
  authorId: 10,
  likesCount: 5,
  commentsCount: 2,
  creationDate: "2023-10-01T12:00:00Z",
};

describe("Post Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = true;
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url.includes("/users/")) {
        return Promise.resolve({
          data: {
            id: 10,
            username: "johndoe",
            firstName: "John",
            secondName: "Doe",
          },
        });
      }
      if (url.includes("/comments")) {
        return Promise.resolve({
          data: [{ id: 100, text: "Great post!", authorId: 2, postId: 1 }],
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it("renders post content and author details", async () => {
    render(<Post post={mockPostData} />, { wrapper: createWrapper() });

    expect(screen.getByText("This is a test post.")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("5 likes")).toBeInTheDocument();
  });

  it("handles like click", async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    render(<Post post={mockPostData} />, { wrapper: createWrapper() });

    const heartIcon = screen.getByTestId("icon-heart");
    fireEvent.click(heartIcon);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/like", { postId: 1 });
      expect(screen.getByText("6 likes")).toBeInTheDocument();
    });
  });

  it("shows comments dropdown when clicked", async () => {
    render(<Post post={mockPostData} />, { wrapper: createWrapper() });

    const arrowDownIcon = screen.getByTestId("icon-arrow-down");
    fireEvent.click(arrowDownIcon);

    await waitFor(() => {
      expect(screen.getByText("#1 Great post!")).toBeInTheDocument();
    });
  });

  it("does not allow unauthenticated users to like", () => {
    mockIsAuthenticated = false;
    render(<Post post={mockPostData} />, { wrapper: createWrapper() });

    const heartIcon = screen.getByTestId("icon-heart");
    fireEvent.click(heartIcon);

    expect(api.post).not.toHaveBeenCalled();
    expect(mockAddToast).toHaveBeenCalled();
  });

  it("handles dislike click when already liked", async () => {
    (api.post as jest.Mock).mockResolvedValue({});
    const likedPostData = {
      ...mockPostData,
      likesCount: 5,
      likedByUsers: [
        { id: mockUser.id },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
    };

    render(<Post post={likedPostData} />, { wrapper: createWrapper() });

    const heartIcon = screen.getByTestId("icon-heart");
    fireEvent.click(heartIcon);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/dislike", { postId: 1 });
      expect(screen.getByText("4 likes")).toBeInTheDocument();
    });
  });

  it("handles error on like click", async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error("API Error"));
    render(<Post post={mockPostData} />, { wrapper: createWrapper() });

    const heartIcon = screen.getByTestId("icon-heart");
    fireEvent.click(heartIcon);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("post.likeError", {
        type: "error",
      });
      expect(screen.getByText("5 likes")).toBeInTheDocument();
    });
  });

  it("handles error on dislike click", async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error("API Error"));
    const likedPostData = {
      ...mockPostData,
      likedByUsers: [
        { id: mockUser.id },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ],
    };
    render(<Post post={likedPostData} />, { wrapper: createWrapper() });

    const heartIcon = screen.getByTestId("icon-heart");
    fireEvent.click(heartIcon);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith("post.dislikeError", {
        type: "error",
      });
      expect(screen.getByText("5 likes")).toBeInTheDocument();
    });
  });

  it("handles comment deletion if user is author", async () => {
    (api.delete as jest.Mock).mockResolvedValue({});
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url.includes("/comments")) {
        return Promise.resolve({
          data: [
            { id: 100, text: "Great post!", authorId: mockUser.id, postId: 1 },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(<Post post={mockPostData} />, { wrapper: createWrapper() });

    const arrowDownIcon = screen.getByTestId("icon-arrow-down");
    fireEvent.click(arrowDownIcon);

    await waitFor(() => {
      expect(screen.getByTestId("icon-trash")).toBeInTheDocument();
    });

    const trashIcon = screen.getByTestId("icon-trash");
    fireEvent.click(trashIcon);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/api/comments/100");
      expect(mockAddToast).toHaveBeenCalledWith("post.commentDeleted", {
        type: "success",
      });
    });
  });

  it("handles image load errors", () => {
    const postWithImage = { ...mockPostData, image: "some-image.jpg" };
    render(<Post post={postWithImage} />, { wrapper: createWrapper() });

    const avatar = screen.getByAltText("user avatar");
    fireEvent.error(avatar);
    expect(avatar).toHaveAttribute("src", "avatar.png");

    const postImg = screen.getByAltText("post content");
    fireEvent.error(postImg);
    expect(postImg).toHaveAttribute("src", "avatar.png");
  });
});
