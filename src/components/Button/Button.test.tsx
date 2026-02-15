import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  it("renders with name prop as text", () => {
    render(<Button name="Submit" />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders with children when provided", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("prefers children over name when both provided", () => {
    render(<Button name="Name">Children text</Button>);
    expect(
      screen.getByRole("button", { name: "Children text" }),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<Button name="Click" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button name="Btn" className="custom-class" />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("custom-class");
  });

  it("passes through additional props", () => {
    render(<Button name="Btn" data-testid="my-button" type="submit" />);
    const btn = screen.getByTestId("my-button");
    expect(btn).toHaveAttribute("type", "submit");
  });
});
