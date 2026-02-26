/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render, screen, fireEvent } from "@testing-library/react";
import ChartSwitcher from "./ChartSwitcher";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "statistics.tableView": "Table View",
        "statistics.chartView": "Chart View",
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../Button/Button", () => {
  return function MockButton({
    name,
    onClick,
    className,
    children,
  }: {
    name: string;
    onClick: () => void;
    className: string;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        className={className}
        data-testid="chart-switcher-button"
      >
        <span data-testid="button-name">{name}</span>
        {children}
      </button>
    );
  };
});

describe("ChartSwitcher", () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      expect(screen.getByTestId("chart-switcher-button")).toBeInTheDocument();
    });

    it("renders with chart view label when isChart is false", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      expect(screen.getByTestId("button-name")).toHaveTextContent("Chart View");
    });

    it("renders with table view label when isChart is true", () => {
      render(<ChartSwitcher isChart={true} onToggle={mockOnToggle} />);
      expect(screen.getByTestId("button-name")).toHaveTextContent("Table View");
    });

    it("renders the theme circle indicator", () => {
      const { container } = render(
        <ChartSwitcher isChart={false} onToggle={mockOnToggle} />,
      );
      const circle = container.querySelector(`.themeCircle`);
      expect(circle).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies base themeBlock class", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      const button = screen.getByTestId("chart-switcher-button");
      expect(button.className).toContain("themeBlock");
    });

    it("applies dark class when isChart is true", () => {
      render(<ChartSwitcher isChart={true} onToggle={mockOnToggle} />);
      const button = screen.getByTestId("chart-switcher-button");
      expect(button.className).toContain("dark");
    });

    it("does not apply dark class when isChart is false", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      const button = screen.getByTestId("chart-switcher-button");
      expect(button.className).not.toContain("dark");
    });

    it("applies themeCircleActive class to circle when isChart is true", () => {
      const { container } = render(
        <ChartSwitcher isChart={true} onToggle={mockOnToggle} />,
      );
      const circle = container.querySelector(`.themeCircle`);
      expect(circle?.className).toContain("themeCircleActive");
    });

    it("does not apply themeCircleActive class when isChart is false", () => {
      const { container } = render(
        <ChartSwitcher isChart={false} onToggle={mockOnToggle} />,
      );
      const circle = container.querySelector(`.themeCircle`);
      expect(circle?.className).not.toContain("themeCircleActive");
    });
  });

  describe("Interaction", () => {
    it("calls onToggle when button is clicked", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      const button = screen.getByTestId("chart-switcher-button");

      fireEvent.click(button);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it("calls onToggle multiple times on multiple clicks", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      const button = screen.getByTestId("chart-switcher-button");

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnToggle).toHaveBeenCalledTimes(3);
    });

    it("calls onToggle regardless of isChart state", () => {
      const { rerender } = render(
        <ChartSwitcher isChart={false} onToggle={mockOnToggle} />,
      );
      fireEvent.click(screen.getByTestId("chart-switcher-button"));
      expect(mockOnToggle).toHaveBeenCalledTimes(1);

      mockOnToggle.mockClear();

      rerender(<ChartSwitcher isChart={true} onToggle={mockOnToggle} />);
      fireEvent.click(screen.getByTestId("chart-switcher-button"));
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("State Changes", () => {
    it("updates label when isChart prop changes from false to true", () => {
      const { rerender } = render(
        <ChartSwitcher isChart={false} onToggle={mockOnToggle} />,
      );
      expect(screen.getByTestId("button-name")).toHaveTextContent("Chart View");

      rerender(<ChartSwitcher isChart={true} onToggle={mockOnToggle} />);
      expect(screen.getByTestId("button-name")).toHaveTextContent("Table View");
    });

    it("updates label when isChart prop changes from true to false", () => {
      const { rerender } = render(
        <ChartSwitcher isChart={true} onToggle={mockOnToggle} />,
      );
      expect(screen.getByTestId("button-name")).toHaveTextContent("Table View");

      rerender(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      expect(screen.getByTestId("button-name")).toHaveTextContent("Chart View");
    });

    it("updates styling when isChart changes", () => {
      const { rerender } = render(
        <ChartSwitcher isChart={false} onToggle={mockOnToggle} />,
      );
      let button = screen.getByTestId("chart-switcher-button");
      expect(button.className).not.toContain("dark");

      rerender(<ChartSwitcher isChart={true} onToggle={mockOnToggle} />);
      button = screen.getByTestId("chart-switcher-button");
      expect(button.className).toContain("dark");
    });
  });

  describe("Integration with Button Component", () => {
    it("passes correct props to Button component", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);

      const button = screen.getByTestId("chart-switcher-button");
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId("button-name")).toHaveTextContent("Chart View");
    });

    it("Button receives onClick handler", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);

      const button = screen.getByTestId("chart-switcher-button");
      fireEvent.click(button);

      expect(mockOnToggle).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("button is accessible", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      const button = screen.getByTestId("chart-switcher-button");

      expect(button.tagName).toBe("BUTTON");
    });

    it("has meaningful text in both states", () => {
      const { rerender } = render(
        <ChartSwitcher isChart={false} onToggle={mockOnToggle} />,
      );
      expect(screen.getByTestId("button-name")).toHaveTextContent("Chart View");

      rerender(<ChartSwitcher isChart={true} onToggle={mockOnToggle} />);
      expect(screen.getByTestId("button-name")).toHaveTextContent("Table View");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid toggling", () => {
      render(<ChartSwitcher isChart={false} onToggle={mockOnToggle} />);
      const button = screen.getByTestId("chart-switcher-button");

      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      expect(mockOnToggle).toHaveBeenCalledTimes(10);
    });

    it("works with different onToggle functions", () => {
      const mockOnToggle1 = jest.fn();
      const mockOnToggle2 = jest.fn();

      const { rerender } = render(
        <ChartSwitcher isChart={false} onToggle={mockOnToggle1} />,
      );
      fireEvent.click(screen.getByTestId("chart-switcher-button"));
      expect(mockOnToggle1).toHaveBeenCalledTimes(1);

      rerender(<ChartSwitcher isChart={false} onToggle={mockOnToggle2} />);
      fireEvent.click(screen.getByTestId("chart-switcher-button"));
      expect(mockOnToggle2).toHaveBeenCalledTimes(1);
      expect(mockOnToggle1).toHaveBeenCalledTimes(1);
    });
  });
});
