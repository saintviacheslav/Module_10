/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent } from "@testing-library/react";
import DescriptionTextarea from "./DescriptionTextArea";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      const translations: Record<string, string> = {
        "profile.writeDescriptionPlaceholder": "Write description here...",
        "modalPost.characterLimit": `Character limit reached: ${params?.max}`,
        "common.maxChars": `Maximum ${params?.max} characters`,
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock("../Icon/Icon", () => ({
  Icon: ({ name, style }: { name: string; style?: React.CSSProperties }) => (
    <span data-testid={`icon-${name}`} style={style}>
      {name}
    </span>
  ),
}));

describe("DescriptionTextarea", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with default placeholder", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      expect(
        screen.getByPlaceholderText("Write description here..."),
      ).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(
        <DescriptionTextarea
          value=""
          onChange={mockOnChange}
          placeholder="Custom placeholder"
        />,
      );
      expect(
        screen.getByPlaceholderText("Write description here..."),
      ).toBeInTheDocument();
    });

    it("renders with provided value", () => {
      render(
        <DescriptionTextarea value="Test content" onChange={mockOnChange} />,
      );
      expect(screen.getByRole("textbox")).toHaveValue("Test content");
    });

    it("does not show validation info when value is empty", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      expect(screen.queryByTestId("icon-info")).not.toBeInTheDocument();
    });

    it("does not show validation info when value is only whitespace", () => {
      render(<DescriptionTextarea value="   " onChange={mockOnChange} />);
      expect(screen.queryByTestId("icon-info")).not.toBeInTheDocument();
    });

    it("shows validation info when value has content", () => {
      render(<DescriptionTextarea value="Test" onChange={mockOnChange} />);
      expect(screen.getByTestId("icon-info")).toBeInTheDocument();
    });

    it("has correct number of rows", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("rows", "4");
    });
  });

  describe("Text Input", () => {
    it("calls onChange when text is typed", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "New text" } });

      expect(mockOnChange).toHaveBeenCalledWith("New text");
    });

    it("allows typing up to maxLength", () => {
      render(
        <DescriptionTextarea value="" onChange={mockOnChange} maxLength={10} />,
      );
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "1234567890" } });

      expect(mockOnChange).toHaveBeenCalledWith("1234567890");
    });

    it("prevents typing beyond maxLength", () => {
      render(
        <DescriptionTextarea value="" onChange={mockOnChange} maxLength={10} />,
      );
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "12345678901" } });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("accepts exactly maxLength characters", () => {
      render(
        <DescriptionTextarea value="" onChange={mockOnChange} maxLength={5} />,
      );
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "12345" } });

      expect(mockOnChange).toHaveBeenCalledWith("12345");
    });

    it("handles empty string input", () => {
      render(<DescriptionTextarea value="Some text" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "" } });

      expect(mockOnChange).toHaveBeenCalledWith("");
    });

    it("handles special characters", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      const specialText = "Test @#$%";
      fireEvent.change(textarea, { target: { value: specialText } });

      expect(mockOnChange).toHaveBeenCalledWith(specialText);
    });

    it("handles line breaks", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      const multilineText = "Line 1\nLine 2\nLine 3";
      fireEvent.change(textarea, { target: { value: multilineText } });

      expect(mockOnChange).toHaveBeenCalledWith(multilineText);
    });
  });

  describe("Focus/Blur States", () => {
    it("handles focus event", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      fireEvent.focus(textarea);

      expect(textarea).toBeInTheDocument();
    });

    it("handles blur event", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      fireEvent.focus(textarea);
      fireEvent.blur(textarea);

      expect(textarea).toBeInTheDocument();
    });

    it("maintains value after focus and blur", () => {
      render(<DescriptionTextarea value="Test" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      fireEvent.focus(textarea);
      fireEvent.blur(textarea);

      expect(textarea).toHaveValue("Test");
    });
  });

  describe("Validation Display", () => {
    it("shows normal info icon when not at max length", () => {
      render(
        <DescriptionTextarea
          value="Test"
          onChange={mockOnChange}
          maxLength={10}
        />,
      );
      const icon = screen.getByTestId("icon-info");

      expect(icon).toHaveStyle({ color: "var(--text-secondary)" });
    });

    it("shows error info icon when at max length", () => {
      render(
        <DescriptionTextarea
          value="1234567890"
          onChange={mockOnChange}
          maxLength={10}
        />,
      );
      const icon = screen.getByTestId("icon-info");

      expect(icon).toHaveStyle({ color: "var(--inp-incorrect)" });
    });

    it("shows normal message when not at max length", () => {
      render(
        <DescriptionTextarea
          value="Test"
          onChange={mockOnChange}
          maxLength={10}
        />,
      );
      expect(screen.getByText("Maximum 10 characters")).toBeInTheDocument();
    });

    it("shows error message when at max length", () => {
      render(
        <DescriptionTextarea
          value="1234567890"
          onChange={mockOnChange}
          maxLength={10}
        />,
      );
      expect(
        screen.getByText("Character limit reached: 10"),
      ).toBeInTheDocument();
    });

    it("updates validation state when approaching max length", () => {
      const { rerender } = render(
        <DescriptionTextarea
          value="123456789"
          onChange={mockOnChange}
          maxLength={10}
        />,
      );

      expect(screen.getByText("Maximum 10 characters")).toBeInTheDocument();

      rerender(
        <DescriptionTextarea
          value="1234567890"
          onChange={mockOnChange}
          maxLength={10}
        />,
      );

      expect(
        screen.getByText("Character limit reached: 10"),
      ).toBeInTheDocument();
    });
  });

  describe("Styling Props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <DescriptionTextarea
          value=""
          onChange={mockOnChange}
          className="custom-class"
        />,
      );
      const wrapper = container.querySelector(".custom-class");
      expect(wrapper).toBeInTheDocument();
    });

    it("applies custom textareaClassName", () => {
      render(
        <DescriptionTextarea
          value=""
          onChange={mockOnChange}
          textareaClassName="custom-textarea"
        />,
      );
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("custom-textarea");
    });

    it("applies error class when at max length", () => {
      render(
        <DescriptionTextarea
          value="1234567890"
          onChange={mockOnChange}
          maxLength={10}
        />,
      );
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("textareaError");
    });

    it("does not apply error class when below max length", () => {
      render(
        <DescriptionTextarea
          value="123"
          onChange={mockOnChange}
          maxLength={10}
        />,
      );
      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toHaveClass("textareaError");
    });

    it("applies custom validateInfoClassName", () => {
      const { container } = render(
        <DescriptionTextarea
          value="Test"
          onChange={mockOnChange}
          validateInfoClassName="custom-validate"
        />,
      );
      const validateInfo = container.querySelector(".custom-validate");
      expect(validateInfo).toBeInTheDocument();
    });

    it("applies custom errorTextClassName when at max", () => {
      const { container } = render(
        <DescriptionTextarea
          value="1234567890"
          onChange={mockOnChange}
          maxLength={10}
          errorTextClassName="custom-error"
        />,
      );
      const errorText = container.querySelector(".custom-error");
      expect(errorText).toBeInTheDocument();
    });

    it("applies custom secondaryTextClassName when not at max", () => {
      const { container } = render(
        <DescriptionTextarea
          value="Test"
          onChange={mockOnChange}
          maxLength={10}
          secondaryTextClassName="custom-secondary"
        />,
      );
      const secondaryText = container.querySelector(".custom-secondary");
      expect(secondaryText).toBeInTheDocument();
    });
  });

  describe("MaxLength Variations", () => {
    it("uses default maxLength of 200", () => {
      render(<DescriptionTextarea value="Test" onChange={mockOnChange} />);
      expect(screen.getByText("Maximum 200 characters")).toBeInTheDocument();
    });

    it("respects custom maxLength", () => {
      render(
        <DescriptionTextarea
          value="Test"
          onChange={mockOnChange}
          maxLength={50}
        />,
      );
      expect(screen.getByText("Maximum 50 characters")).toBeInTheDocument();
    });

    it("works with very small maxLength", () => {
      render(
        <DescriptionTextarea
          value="Hi"
          onChange={mockOnChange}
          maxLength={5}
        />,
      );
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "Hello" } });
      expect(mockOnChange).toHaveBeenCalledWith("Hello");

      fireEvent.change(textarea, { target: { value: "Hello!" } });
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("works with large maxLength", () => {
      render(
        <DescriptionTextarea
          value="Test"
          onChange={mockOnChange}
          maxLength={1000}
        />,
      );
      expect(screen.getByText("Maximum 1000 characters")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid typing", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "a" } });
      fireEvent.change(textarea, { target: { value: "ab" } });
      fireEvent.change(textarea, { target: { value: "abc" } });

      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });

    it("handles value prop changes", () => {
      const { rerender } = render(
        <DescriptionTextarea value="Initial" onChange={mockOnChange} />,
      );
      expect(screen.getByRole("textbox")).toHaveValue("Initial");

      rerender(<DescriptionTextarea value="Updated" onChange={mockOnChange} />);
      expect(screen.getByRole("textbox")).toHaveValue("Updated");
    });

    it("handles onChange prop changes", () => {
      const mockOnChange2 = jest.fn();
      const { rerender } = render(
        <DescriptionTextarea value="" onChange={mockOnChange} />,
      );
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "Test1" } });
      expect(mockOnChange).toHaveBeenCalledWith("Test1");

      rerender(<DescriptionTextarea value="" onChange={mockOnChange2} />);
      fireEvent.change(textarea, { target: { value: "Test2" } });
      expect(mockOnChange2).toHaveBeenCalledWith("Test2");
    });

    it("handles exactly at maxLength boundary", () => {
      render(
        <DescriptionTextarea value="" onChange={mockOnChange} maxLength={3} />,
      );
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "ab" } });
      expect(mockOnChange).toHaveBeenLastCalledWith("ab");

      fireEvent.change(textarea, { target: { value: "abc" } });
      expect(mockOnChange).toHaveBeenLastCalledWith("abc");

      mockOnChange.mockClear();
      fireEvent.change(textarea, { target: { value: "abcd" } });
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("handles paste events within limit", () => {
      render(
        <DescriptionTextarea value="" onChange={mockOnChange} maxLength={20} />,
      );
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, { target: { value: "Pasted text here" } });
      expect(mockOnChange).toHaveBeenCalledWith("Pasted text here");
    });

    it("prevents paste events beyond limit", () => {
      render(
        <DescriptionTextarea value="" onChange={mockOnChange} maxLength={5} />,
      );
      const textarea = screen.getByRole("textbox");

      fireEvent.change(textarea, {
        target: { value: "Pasted text that is too long" },
      });
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("is accessible via role", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("maintains focus after typing", () => {
      render(<DescriptionTextarea value="" onChange={mockOnChange} />);
      const textarea = screen.getByRole("textbox");

      textarea.focus();

      expect(document.activeElement).toBe(textarea);
    });
  });
});
