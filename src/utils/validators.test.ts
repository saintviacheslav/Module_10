import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "./validators";
import type { TFunction } from "i18next";

const mockT = ((key: string, options?: unknown) => {
  if (options && typeof options === "object" && "min" in options) {
    return `${key} min:${options.min}`;
  }
  return key;
}) as TFunction;

describe("validateEmail", () => {
  it("returns error when value is empty", () => {
    expect(validateEmail("", mockT)).toBe("errors.emailRequired");
    expect(validateEmail("   ", mockT)).toBe("errors.emailRequired");
  });

  it("returns error when email format is invalid", () => {
    expect(validateEmail("invalid", mockT)).toBe("errors.emailInvalid");
    expect(validateEmail("missing@domain", mockT)).toBe("errors.emailInvalid");
    expect(validateEmail("@nodomain.com", mockT)).toBe("errors.emailInvalid");
    expect(validateEmail("noatsign.com", mockT)).toBe("errors.emailInvalid");
  });

  it("returns empty string for valid email", () => {
    expect(validateEmail("user@mail.com", mockT)).toBe("");
    expect(validateEmail("  user@example.co.uk  ", mockT)).toBe("");
    expect(validateEmail("a@b.co", mockT)).toBe("");
  });
});

describe("validatePassword", () => {
  it("returns error when password is empty", () => {
    expect(validatePassword("", mockT)).toBe("errors.passwordRequired");
  });

  it("returns error when password is shorter than 6 characters", () => {
    expect(validatePassword("12345", mockT)).toBe(
      "errors.passwordMinLength min:6",
    );
    expect(validatePassword("a", mockT)).toBe("errors.passwordMinLength min:6");
  });

  it("returns empty string for valid password (6+ characters)", () => {
    expect(validatePassword("123456", mockT)).toBe("");
    expect(validatePassword("password", mockT)).toBe("");
    expect(validatePassword("longpassword", mockT)).toBe("");
  });
});

describe("validateUsername", () => {
  it("returns empty string when value is empty or whitespace", () => {
    expect(validateUsername("", mockT)).toBe("");
    expect(validateUsername("   ", mockT)).toBe("");
  });

  it("returns error when username does not start with @", () => {
    expect(validateUsername("john", mockT)).toBe(
      "errors.usernameMustStartWithAt",
    );
    expect(validateUsername("user123", mockT)).toBe(
      "errors.usernameMustStartWithAt",
    );
  });

  it("returns error when username is shorter than 3 characters", () => {
    expect(validateUsername("@a", mockT)).toBe(
      "errors.usernameMinLength min:3",
    );
    expect(validateUsername("@", mockT)).toBe("errors.usernameMinLength min:3");
  });

  it("returns error when username contains spaces", () => {
    expect(validateUsername("@user name", mockT)).toBe(
      "errors.usernameNoSpaces",
    );
    expect(validateUsername("@ user", mockT)).toBe("errors.usernameNoSpaces");
  });

  it("returns empty string for valid username", () => {
    expect(validateUsername("@john", mockT)).toBe("");
    expect(validateUsername("@helena", mockT)).toBe("");
    expect(validateUsername("@user123", mockT)).toBe("");
  });
});
