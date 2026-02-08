export function validateEmail(value: string): string {
  if (!value.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    return "Email is not valid";
  }

  return "";
}

export function validatePassword(value: string): string {
  if (!value) {
    return "Password is required";
  }

  if (value.length < 6) {
    return "Password must be at least 6 characters";
  }

  return "";
}

export function validateUsername(value: string): string {
  if (!value.trim()) {
    return "";
  }

  if (!value.startsWith("@")) {
    return "Username must start with @";
  }

  if (value.length < 3) {
    return "Username must be at least 3 characters";
  }

  if (value.includes(" ")) {
    return "Username cannot contain spaces";
  }

  return "";
}

