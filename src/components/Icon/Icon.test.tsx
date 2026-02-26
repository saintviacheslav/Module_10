/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

const ICONS = [
  "envelope",
  "check",
  "cross-small",
  "cross",
  "pencil",
  "user",
  "info",
  "notfound",
  "trash",
  "logo",
  "comment",
  "eye",
  "eye-crossed",
  "heart",
  "arrow-down",
  "arrow-up",
  "burger-menu",
  "file-download",
  "like",
];

jest.mock("../../assets/images/envelope.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/check.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/cross-small.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/cross.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/pencil.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/user.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/info.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/404.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/trash.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/sidekick_logo.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/message.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/eye.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/eye-crossed.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/heart.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/arrowdown.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/arrowup.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/burgermenu.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/file-download.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));
jest.mock("../../assets/images/like.svg", () => ({
  ReactComponent: (props: any) => <svg {...props} />,
}));

describe("Icon Component", () => {
  ICONS.forEach((iconName) => {
    it(`renders ${iconName} correctly`, () => {
      const { container } = render(<Icon name={iconName as any} />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass(`icon--${iconName}`);
    });
  });

  it("applies custom className", () => {
    const { container } = render(<Icon name="user" className="custom-icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("icon--user", "custom-icon");
  });

  it("sets width and height from size prop", () => {
    const { container } = render(<Icon name="heart" size={30} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "30");
    expect(svg).toHaveAttribute("height", "30");
  });

  it("returns null for unknown icon", () => {
    // @ts-ignore
    const { container } = render(<Icon name="unknown" />);
    expect(container).toBeEmptyDOMElement();
  });
});
