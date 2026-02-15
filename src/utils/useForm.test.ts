import { renderHook, act } from "@testing-library/react";
import { useForm } from "./useForm";

describe("useForm", () => {
  it("initializes with initial values", () => {
    const { result } = renderHook(() =>
      useForm({ email: "", password: "secret" }),
    );
    expect(result.current.values).toEqual({ email: "", password: "secret" });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it("updates field value and clears field error via setFieldValue", () => {
    const { result } = renderHook(() =>
      useForm<{ email: string }>({ email: "" }),
    );

    act(() => {
      result.current.setFieldValue("email", "test@mail.com");
    });
    expect(result.current.values.email).toBe("test@mail.com");
    expect(result.current.errors.email).toBe("");

    act(() => {
      result.current.setFieldError("email", "Invalid");
    });
    expect(result.current.errors.email).toBe("Invalid");

    act(() => {
      result.current.setFieldValue("email", "new@mail.com");
    });
    expect(result.current.values.email).toBe("new@mail.com");
    expect(result.current.errors.email).toBe("");
  });

  it("setFieldError sets error for field", () => {
    const { result } = renderHook(() =>
      useForm<{ email: string }>({ email: "" }),
    );

    act(() => {
      result.current.setFieldError("email", "Email is required");
    });
    expect(result.current.errors.email).toBe("Email is required");
  });

  it("touchField marks field as touched", () => {
    const { result } = renderHook(() =>
      useForm<{ email: string; password: string }>({
        email: "",
        password: "",
      }),
    );

    act(() => {
      result.current.touchField("email");
    });
    expect(result.current.touched.email).toBe(true);
    expect(result.current.touched.password).toBeUndefined();

    act(() => {
      result.current.touchField("password");
    });
    expect(result.current.touched.password).toBe(true);
  });

  it("setErrors replaces errors object", () => {
    const { result } = renderHook(() =>
      useForm<{ email: string; password: string }>({
        email: "",
        password: "",
      }),
    );

    act(() => {
      result.current.setErrors({ email: "E1", password: "E2" });
    });
    expect(result.current.errors).toEqual({ email: "E1", password: "E2" });
  });
});
