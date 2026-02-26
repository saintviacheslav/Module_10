import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

jest.mock("../Icon/Icon", () => ({
  Icon: () => <span data-testid="icon" />,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      key === "auth.passwordStrong" ? "Your password is strong" : key,
  }),
}));

describe("Input", () => {
  it("renders with value and placeholder", () => {
    render(<Input value="" onChange={() => {}} placeholder="Enter email..." />);
    const input = screen.getByPlaceholderText("Enter email...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("calls onChange when value changes", async () => {
    const onChange = jest.fn();
    render(<Input value="" onChange={onChange} placeholder="Email" />);
    const input = screen.getByPlaceholderText("Email");
    await userEvent.type(input, "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows error state and errorText when status is error", () => {
    render(
      <Input
        value=""
        onChange={() => {}}
        status="error"
        errorText="Email is required"
      />,
    );
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("shows success message when status is success", () => {
    render(<Input value="pass" onChange={() => {}} status="success" />);
    expect(screen.getByText("Your password is strong")).toBeInTheDocument();
  });

  it("toggles password visibility when eye button clicked", async () => {
    render(
      <Input
        type="password"
        value="secret"
        onChange={() => {}}
        placeholder="Password"
      />,
    );
    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");
    const toggleButton = screen.getByRole("button");
    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("uses default type text", () => {
    render(<Input value="" onChange={() => {}} placeholder="Text" />);
    expect(screen.getByPlaceholderText("Text")).toHaveAttribute("type", "text");
  });
});
