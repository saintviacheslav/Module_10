/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./ButtonClass";

describe("Button (Class Component)", () => {
  it("renders without crashing", () => {
    render(<Button name="Click me" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("displays the correct button text", () => {
    render(<Button name="Submit" />);
    expect(screen.getByRole("button")).toHaveTextContent("Submit");
  });

  it("applies correct CSS class", () => {
    render(<Button name="Test" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("templateButton");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button name="Click me" onClick={handleClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick multiple times when clicked multiple times", () => {
    const handleClick = jest.fn();
    render(<Button name="Click me" onClick={handleClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it("does not crash when onClick is not provided", () => {
    render(<Button name="No handler" />);
    const button = screen.getByRole("button");

    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("updates text when name prop changes", () => {
    const { rerender } = render(<Button name="Initial" />);
    expect(screen.getByRole("button")).toHaveTextContent("Initial");

    rerender(<Button name="Updated" />);
    expect(screen.getByRole("button")).toHaveTextContent("Updated");
  });

  it("maintains functionality after prop changes", () => {
    const handleClick1 = jest.fn();
    const handleClick2 = jest.fn();

    const { rerender } = render(
      <Button name="Button 1" onClick={handleClick1} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick1).toHaveBeenCalledTimes(1);

    rerender(<Button name="Button 2" onClick={handleClick2} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick2).toHaveBeenCalledTimes(1);
    expect(handleClick1).toHaveBeenCalledTimes(1);
  });

  it("renders with empty string name", () => {
    render(<Button name="" />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("");
  });

  it("renders with special characters in name", () => {
    render(<Button name="Click! @#$%^&*()" />);
    expect(screen.getByRole("button")).toHaveTextContent("Click! @#$%^&*()");
  });

  it("renders with long text", () => {
    const longText = "This is a very long button text that might wrap";
    render(<Button name={longText} />);
    expect(screen.getByRole("button")).toHaveTextContent(longText);
  });

  it("is accessible via role query", () => {
    render(<Button name="Accessible" />);
    expect(
      screen.getByRole("button", { name: "Accessible" }),
    ).toBeInTheDocument();
  });

  describe("Lifecycle Methods", () => {
    it("initializes with correct state", () => {
      const { container } = render(<Button name="Test" />);
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    it("shouldComponentUpdate returns true (always updates)", () => {
      const { rerender } = render(<Button name="First" />);
      rerender(<Button name="Second" />);

      expect(screen.getByRole("button")).toHaveTextContent("Second");
    });

    it("handles getDerivedStateFromProps correctly", () => {
      const { rerender } = render(<Button name="Initial" />);
      rerender(<Button name="Updated" />);

      expect(screen.getByRole("button")).toHaveTextContent("Updated");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid clicks", () => {
      const handleClick = jest.fn();
      render(<Button name="Rapid" onClick={handleClick} />);

      const button = screen.getByRole("button");

      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }

      expect(handleClick).toHaveBeenCalledTimes(10);
    });

    it("renders correctly when re-mounted", () => {
      const { unmount } = render(<Button name="First" />);
      unmount();

      render(<Button name="Second" />);
      expect(screen.getByRole("button")).toHaveTextContent("Second");
    });
  });
});
