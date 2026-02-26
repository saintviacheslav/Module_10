/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import { BarChartComments } from "./BarChartComments";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: any[];
  }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }: { dataKey: string; fill: string }) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill} />
  ),
  XAxis: ({ dataKey }: { dataKey: string }) => (
    <div data-testid="x-axis" data-key={dataKey} />
  ),
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe("BarChartComments", () => {
  const mockData = [
    { month: "Jan", comments: 10 },
    { month: "Feb", comments: 20 },
    { month: "Mar", comments: 15 },
  ];

  it("renders without crashing", () => {
    render(<BarChartComments data={mockData} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("renders BarChart component", () => {
    render(<BarChartComments data={mockData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("passes correct data to BarChart", () => {
    render(<BarChartComments data={mockData} />);
    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]",
    );
    expect(chartData).toEqual(mockData);
  });

  it("renders all chart components", () => {
    render(<BarChartComments data={mockData} />);

    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("bar")).toBeInTheDocument();
  });

  it("configures XAxis with correct dataKey", () => {
    render(<BarChartComments data={mockData} />);
    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis.getAttribute("data-key")).toBe("month");
  });

  it("configures Bar with correct dataKey", () => {
    render(<BarChartComments data={mockData} />);
    const bar = screen.getByTestId("bar");
    expect(bar.getAttribute("data-key")).toBe("comments");
  });

  it("applies correct fill color to Bar", () => {
    render(<BarChartComments data={mockData} />);
    const bar = screen.getByTestId("bar");
    expect(bar.getAttribute("data-fill")).toBe("var(--charts-color)");
  });

  it("renders with empty data array", () => {
    render(<BarChartComments data={[]} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]",
    );
    expect(chartData).toEqual([]);
  });

  it("renders with single data point", () => {
    const singleData = [{ month: "Jan", comments: 5 }];
    render(<BarChartComments data={singleData} />);
    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]",
    );
    expect(chartData).toEqual(singleData);
  });

  it("renders with large dataset", () => {
    const largeData = Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      comments: Math.floor(Math.random() * 100),
    }));
    render(<BarChartComments data={largeData} />);
    const barChart = screen.getByTestId("bar-chart");
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]",
    );
    expect(chartData).toEqual(largeData);
    expect(chartData).toHaveLength(12);
  });

  it("has correct wrapper styling", () => {
    const { container } = render(<BarChartComments data={mockData} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: "100%", height: "100%" });
  });
});
