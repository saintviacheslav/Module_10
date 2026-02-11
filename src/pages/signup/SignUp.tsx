import { FormEvent, useState } from "react";
import style from "./signup.module.css";
import Button from "../../components/ButtonClass/ButtonClass";
import Input from "../../components/Input/Input";
import { users } from "../../mock/users";
import { useForm } from "../../utils/useForm";
import { validateEmail, validatePassword } from "../../utils/validators";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Icon } from "../../components/Icon/Icon";
import { useToast } from "../../context/ToastProvider";

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { values, errors, setFieldValue, setFieldError } = useForm({
    email: "",
    password: "",
  });

  const [emailValidCheck, setEmailValidCheck] = useState<boolean>(false);
  const [passwordValidCheck, setPasswordValidCheck] = useState<boolean>(false);

  const MAX_EMAIL_LENGTH = 50;

  const isEmailMax = values.email.length === MAX_EMAIL_LENGTH;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    let hasError = false;

    if (emailError) {
      setFieldError("email", emailError);
      hasError = true;
    }

    if (passwordError) {
      setFieldError("password", passwordError);
      hasError = true;
    }

    if (isEmailMax) {
      hasError = true;
      setFieldError(
        "email",
        `Email cannot exceed ${MAX_EMAIL_LENGTH} characters`,
      );
      addToast(`Email has reached the ${MAX_EMAIL_LENGTH} character limit`, {
        type: "warning",
      });
    }

    if (hasError) {
      addToast("Please fix the errors above", { type: "error" });
      return;
    }

    const emailExists = users.some((user) => user.email === values.email);

    if (emailExists) {
      setFieldError("email", "Email already exists");
      addToast("Please fix the errors above", { type: "error" });
      return;
    }

    users.push({
      id: Date.now(),
      email: values.email,
      password: values.password,
      name: "",
      surname: "",
      username: "@default",
      avatar: "women.png",
    });

    login(values.email, values.password);
    addToast("Successful registration", { type: "success" });
    navigate("/");
  }

  return (
    <div className={style.container}>
      <main className={style.contentContainer}>
        <form onSubmit={handleSubmit} className={style.content}>
          <div className={style.preview}>
            <h1 className={style.title}>Create an account</h1>
            <p className={style.signinDescription}>
              Enter your email and password to sign up for this app
            </p>
          </div>

          <div className={style.inputArea}>
            <div className={style.inputBlock}>
              <div className={style.hint}>
                <div className={style.hintContent}>
                  <Icon name="envelope" />
                  <p>Email</p>
                </div>
                {errors.email && <Icon name="cross-small" />}
                {emailValidCheck && !errors.email && !isEmailMax && (
                  <Icon name="check" />
                )}
              </div>

              <Input
                value={values.email}
                onChange={(e) => {
                  const newEmail = e.target.value;
                  if (newEmail.length <= MAX_EMAIL_LENGTH) {
                    setFieldValue("email", newEmail);
                  }
                  const isValid = validateEmail(newEmail) === "";
                  setEmailValidCheck(isValid);
                }}
                status={errors.email || isEmailMax ? "error" : "default"}
                errorText={
                  errors.email ||
                  (isEmailMax
                    ? `Reached the ${MAX_EMAIL_LENGTH} character limit`
                    : "")
                }
                placeholder="Enter email..."
              />
            </div>

            <div className={style.inputBlock}>
              <div className={style.hint}>
                <div className={style.hintContent}>
                  <Icon name="eye" />
                  <p>Password</p>
                </div>
                {errors.password && <Icon name="cross-small" />}
                {passwordValidCheck && !errors.password && (
                  <Icon name="check" />
                )}
              </div>

              <Input
                type="password"
                value={values.password}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setFieldValue("password", newPassword);
                  const isValid = validatePassword(newPassword) === "";
                  setPasswordValidCheck(isValid);
                }}
                status={
                  errors.password
                    ? "error"
                    : passwordValidCheck
                      ? "success"
                      : "default"
                }
                errorText={errors.password}
                placeholder="Enter password..."
              />
            </div>

            <Button name="Sign Up" />

            <p className={style.privacyText}>
              By clicking continue, you agree to our{" "}
              <span className={style.privacyGray}>Terms of Service</span> and{" "}
              <span className={style.privacyGray}>Privacy Policy</span>
            </p>

            <p className={style.navigation}>
              Already have an account?{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signin")}
                className={style.switch_auth_pages}
              >
                Sign In
              </span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
