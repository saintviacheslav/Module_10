import { render, screen } from "@testing-library/react";
import NotFound from "./NotFound";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      key === "errors.pageNotFound" ? "Page not found" : key,
  }),
}));

jest.mock("../../components/Icon/Icon", () => ({
  Icon: ({ name }: any) => <span data-testid={`icon-${name}`} />,
}));

describe("NotFound Page", () => {
  it("renders correctly", () => {
    render(<NotFound />);
    expect(screen.getByTestId("icon-notfound")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
