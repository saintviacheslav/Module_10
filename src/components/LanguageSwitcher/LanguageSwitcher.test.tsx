import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSwitcher from "./LanguageSwitcher";

const mockChangeLanguage = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      language: "en",
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

describe("LanguageSwitcher Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders language buttons", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("RU")).toBeInTheDocument();
  });

  it("calls changeLanguage when a button is clicked", () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText("RU"));
    expect(mockChangeLanguage).toHaveBeenCalledWith("ru");
  });
});
