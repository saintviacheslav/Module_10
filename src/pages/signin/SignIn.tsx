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
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { values, errors, setFieldValue, setFieldError } = useForm({
    email: "",
    password: "",
  });

  const [emailValidCheck, setEmailValidCheck] = useState<boolean>(false);
  const [passwordValidCheck, setPasswordValidCheck] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_EMAIL_LENGTH = 50;
  const isEmailMax = values.email.length === MAX_EMAIL_LENGTH;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const emailError = validateEmail(values.email, t);
    const passwordError = validatePassword(values.password, t);

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
      addToast(t("errors.fixErrorsAbove"), { type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      await login(values.email, values.password);
      addToast(t("errors.successfulAuth"), { type: "success" });
      navigate("/");
    } catch (err: unknown) {
      let errMsg = t("errors.invalidCredentials");

      if (err instanceof Error) {
        errMsg = err.message || errMsg;
      } else if (err && typeof err === "object" && "message" in err) {
        const customErr = err as { message?: string };
        if (customErr.message) {
          errMsg = customErr.message;
        }
      }

      setFieldError("password", errMsg);
      addToast(errMsg, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={style.container}>
      <main className={style.contentContainer}>
        <form className={style.content} onSubmit={handleSubmit}>
          <div className={style.preview}>
            <h1 className={style.title}>{t("auth.signInTitle")}</h1>
            <p className={style.signinDescription}>
              {t("auth.signInDescription")}
            </p>
          </div>

          <div className={style.inputArea}>
            <div className={style.inputBlock}>
              <div className={style.hint}>
                <div className={style.hintContent}>
                  <Icon name="envelope" />
                  <p>{t("auth.email")}</p>
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
                  const isValid = validateEmail(newEmail, t) === "";
                  setEmailValidCheck(isValid);
                }}
                status={errors.email || isEmailMax ? "error" : "default"}
                errorText={
                  errors.email ||
                  (isEmailMax
                    ? `Reached the ${MAX_EMAIL_LENGTH} character limit`
                    : "")
                }
                placeholder={t("auth.enterEmail")}
                disabled={isSubmitting}
              />
            </div>

            <div className={style.inputBlock}>
              <div className={style.hint}>
                <div className={style.hintContent}>
                  <Icon name="eye" />
                  <p>{t("auth.password")}</p>
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
                  const isValid = validatePassword(newPassword, t) === "";
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
                placeholder={t("auth.enterPassword")}
                disabled={isSubmitting}
              />
            </div>

            <ButtonClass name={t("common.signIn")} />

            <p className={style.navigation}>
              {t("auth.forgotAccount")}{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signup")}
                className={style.switchAuthPages}
              >
                {t("common.signUp")}
              </span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
