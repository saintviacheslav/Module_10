import { ChangeEvent, FormEvent, useState } from "react";
import style from "./signup.module.css";
import Button from "../../components/ButtonClass/ButtonClass";
import Input from "../../components/Input/Input";
import { useForm } from "../../utils/useForm";
import { validateEmail, validatePassword } from "../../utils/validators";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Icon } from "../../components/Icon/Icon";
import { useToast } from "../../context/ToastProvider";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

export default function SignUp() {
  const { t } = useTranslation();
  const { signup } = useAuth();
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
        t("errors.emailMaxLength", { max: MAX_EMAIL_LENGTH }),
      );
      addToast(t("errors.emailReachedLimit", { max: MAX_EMAIL_LENGTH }), {
        type: "warning",
      });
    }

    if (hasError) {
      addToast(t("errors.fixErrorsAbove"), { type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(values.email, values.password);

      addToast(t("errors.successfulRegistration"), { type: "success" });

      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (err: unknown) {
      let errMsg = t("errors.registrationFailed");

      if (err instanceof AxiosError && err.response?.data) {
        const serverData = err.response.data as { message?: string };
        if (serverData.message) {
          errMsg = serverData.message;
        }
      } else if (err instanceof Error) {
        errMsg = err.message || errMsg;
      }

      const lowerMsg = errMsg.toLowerCase();

      if (
        lowerMsg.includes("email") ||
        lowerMsg.includes("exists") ||
        lowerMsg.includes("already")
      ) {
        setFieldError("email", errMsg);
      } else {
        setFieldError("password", errMsg);
      }

      addToast(errMsg, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const newEmail = e.target.value;
    if (newEmail.length <= MAX_EMAIL_LENGTH) {
      setFieldValue("email", newEmail);
    }
    const isValid = validateEmail(newEmail, t) === "";
    setEmailValidCheck(isValid);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const newPassword = e.target.value;
    setFieldValue("password", newPassword);
    const isValid = validatePassword(newPassword, t) === "";
    setPasswordValidCheck(isValid);
  }

  return (
    <div className={style.container}>
      <main className={style.contentContainer}>
        <form onSubmit={handleSubmit} className={style.content}>
          <div className={style.preview}>
            <h1 className={style.title}>{t("auth.signUpTitle")}</h1>
            <p className={style.signinDescription}>
              {t("auth.signUpFormDescription")}
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
                onChange={handleEmailChange}
                status={errors.email || isEmailMax ? "error" : "default"}
                errorText={
                  errors.email ||
                  (isEmailMax
                    ? t("errors.reachedCharacterLimit", {
                        max: MAX_EMAIL_LENGTH,
                      })
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
                onChange={handlePasswordChange}
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

            <Button name={t("common.signUp")} />

            <p
              className={style.privacyText}
              dangerouslySetInnerHTML={{ __html: t("auth.agreeToTerms") }}
            />

            <p className={style.navigation}>
              {t("auth.haveAccount")}{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/signin");
                }}
                className={style.switchAuthPages}
              >
                {t("common.signIn")}
              </span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
