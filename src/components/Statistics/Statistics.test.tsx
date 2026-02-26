import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Statistics from "./Statistics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { api } from "../../lib/api/axios";

const mockUseAuth = jest.fn();
jest.mock("../../context/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "statistics.posts": "Posts",
        "statistics.likes": "Likes",
        "statistics.comments": "Comments",
        "statistics.perMonth": "per month",
        "statistics.tableView": "Table View",
        "statistics.chartView": "Chart View",
        "statistics.enableChartView": "Enable Chart View",
        "common.loading": "Loading",
        "statistics.title": "Title",
        "statistics.col1": "Post",
        "statistics.col2": "Likes",
        "statistics.col3": "Comments",
        "statistics.noData": "No data available",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../../lib/api/axios", () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock("../LineChartLikes/LineChartLikes", () => ({
  LineChartLikes: () => <div data-testid="line-chart-likes" />,
}));

jest.mock("../BarChartComments/BarChartComments", () => ({
  BarChartComments: () => <div data-testid="bar-chart-comments" />,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Statistics Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ user: { id: 1, username: "testuser" } });

    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === "/api/me/posts") {
        return Promise.resolve({
          data: [
            {
              id: 1,
              title: "Test Post 1",
              content: "Content 1",
              authorId: 1,
              likesCount: 10,
              commentsCount: 5,
              creationDate: "2023-10-01T12:00:00Z",
            },
          ],
        });
      }
      if (url === "/api/me/likes/count") {
        return Promise.resolve({ data: { count: 42 } });
      }
      if (url === "/api/me/comments/count") {
        return Promise.resolve({ data: { count: 12 } });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it("renders loading state initially", () => {
    render(<Statistics />, { wrapper: createWrapper() });
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  it("renders statistics cards after loading", async () => {
    render(<Statistics />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("toggles chart view", async () => {
    render(<Statistics />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Enable Chart View")).toBeInTheDocument();
    expect(screen.queryByTestId("line-chart-likes")).not.toBeInTheDocument();

    const switchers = screen.getAllByRole("button");
    fireEvent.click(switchers[0]);

    expect(screen.getByText("Chart View")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart-likes")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart-comments")).toBeInTheDocument();
  });
});
