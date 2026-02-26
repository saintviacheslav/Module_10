import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders copyright text", () => {
    render(<Footer />);
    expect(screen.getByText("© 2026 sidekick")).toBeInTheDocument();
  });
});
