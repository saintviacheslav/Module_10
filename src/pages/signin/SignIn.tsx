import { FormEvent, useState } from "react";
import style from "./signin.module.css";
import ButtonClass from "../../components/ButtonClass/ButtonClass";
import Input from "../../components/Input/Input";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../../src/utils/useForm";
import { validateEmail, validatePassword } from "../../utils/validators";
import { Icon } from "../../components/Icon/Icon";
import { useToast } from "../../context/ToastProvider";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { values, errors, setFieldValue, setFieldError } = useForm({
    email: "",
    password: "",
  });

  const [emailValidCheck, setEmailValidCheck] = useState<boolean>(false);
  const [passwordValidCheck, setPasswordValidCheck] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    if (emailError || passwordError) {
      setFieldError("email", emailError);
      setFieldError("password", passwordError);
      addToast("Please fix the errors above", { type: "error" });
      return;
    }

    const success = login(values.email, values.password);

    if (!success) {
      setFieldError("password", "Invalid email or password");
      addToast("Please fix the errors above", { type: "error" });
      return;
    }

    addToast("Successful authorization", { type: "success" });
    navigate("/");
  }

  return (
    <div className={style.container}>
      <main className={style.contentContainer}>
        <form className={style.content} onSubmit={handleSubmit}>
          <div className={style.preview}>
            <h1 className={style.title}>Sign in into an account</h1>
            <p className={style.signinDescription}>
              Enter your email and password to sign in into this app
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
                {emailValidCheck && !errors.email && <Icon name="check" />}
              </div>

              <Input
                value={values.email}
                onChange={(e) => {
                  const newEmail = e.target.value;
                  setFieldValue("email", newEmail);
                  const isValid = validateEmail(newEmail) === "";
                  setEmailValidCheck(isValid);
                }}
                status={errors.email ? "error" : "default"}
                errorText={errors.email}
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

            <ButtonClass name="Sign In" />

            <p className={style.navigation}>
              Forgot to create an account?{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signup")}
                className={style.switch_auth_pages}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
