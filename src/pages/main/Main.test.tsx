/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Main from "./Main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";

let mockIsAuthenticated = false;

jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated,
    user: { profileImage: "" },
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../../components/Post/Post", () => ({ post }: any) => (
  <div data-testid="post">{post.title}</div>
));
jest.mock(
  "../../components/ModalPost/ModalPost",
  () =>
    ({ isOpen, onClose }: any) => {
      if (!isOpen) return null;
      return (
        <div data-testid="modal-post">
          <button onClick={onClose}>Close</button>
        </div>
      );
    },
);

jest.mock("../../lib/api/axios", () => ({
  api: {
    get: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Main Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAuthenticated = false;
  });

  it("renders feed with no posts", async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(<Main />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("main.noPostsYet")).toBeInTheDocument();
    });
  });

  it("renders feed with posts", async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Post 1",
          content: "",
          authorId: 1,
          creationDate: "2023-01-01",
        },
        {
          id: 2,
          title: "Post 2",
          content: "",
          authorId: 1,
          creationDate: "2023-01-02",
        },
      ],
    });

    render(<Main />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Post 1")).toBeInTheDocument();
      expect(screen.getByText("Post 2")).toBeInTheDocument();
    });
  });

  it("renders suggested people and groups when authenticated", async () => {
    mockIsAuthenticated = true;
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === "/api/posts") return Promise.resolve({ data: [] });
      if (url === "/api/getSuggested")
        return Promise.resolve({
          data: [{ id: 1, username: "user1", firstName: "Test" }],
        });
      if (url === "/api/groups")
        return Promise.resolve({
          data: [{ id: 1, title: "Group 1", membersCount: 10 }],
        });
      return Promise.resolve({ data: [] });
    });

    render(<Main />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("@user1")).toBeInTheDocument();
      expect(screen.getByText("Group 1")).toBeInTheDocument();
      expect(screen.getByText("10 members")).toBeInTheDocument();
    });
  });

  it("opens and closes modal when authenticated", async () => {
    mockIsAuthenticated = true;
    (api.get as jest.Mock).mockResolvedValue({ data: [] });

    render(<Main />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("main.tellEveryone")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("main.tellEveryone"));
    expect(screen.getByTestId("modal-post")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("modal-post")).not.toBeInTheDocument();
  });
});
