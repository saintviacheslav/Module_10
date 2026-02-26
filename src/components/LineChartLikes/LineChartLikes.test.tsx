import { render } from "@testing-library/react";
import { LineChartLikes } from "./LineChartLikes";

let mockCustomDot: any;
let mockTickFormatter: any;

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div style={{ width: 800, height: 400 }}>{children}</div>
  ),
  LineChart: ({ children }: any) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: (props: any) => {
    mockCustomDot = props.dot;
    return <div data-testid="mock-line" />;
  },
  XAxis: () => <div />,
  YAxis: (props: any) => {
    mockTickFormatter = props.tickFormatter;
    return <div data-testid="mock-yaxis" />;
  },
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Dot: () => <div data-testid="custom-dot" />,
}));

describe("LineChartLikes Component", () => {
  const mockData = [
    { date: "Oct 1", likes: 10 },
    { date: "Oct 2", likes: 20 },
  ];

  it("renders without crashing", () => {
    render(<LineChartLikes data={mockData} />);
    expect(mockCustomDot).toBeDefined();
    expect(mockTickFormatter).toBeDefined();
  });

  it("calls customDot correctly", () => {
    render(<LineChartLikes data={mockData} />);

    const dotResultLast = mockCustomDot({ cx: 10, cy: 10, index: 1 });
    expect(dotResultLast).not.toBeNull();

    const dotResultFirst = mockCustomDot({ cx: 10, cy: 10, index: 0 });
    expect(dotResultFirst).toBeNull();
  });

  it("calls tickFormatter correctly", () => {
    render(<LineChartLikes data={mockData} />);
    expect(mockTickFormatter(100)).toBe("100");
  });
});
