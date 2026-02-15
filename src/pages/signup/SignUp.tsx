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
import { useTranslation } from "react-i18next";

export default function SignUp() {
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

  const MAX_EMAIL_LENGTH = 50;

  const isEmailMax = values.email.length === MAX_EMAIL_LENGTH;

  function handleSubmit(e: FormEvent) {
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

    const emailExists = users.some((user) => user.email === values.email);

    if (emailExists) {
      setFieldError("email", t("errors.emailAlreadyExists"));
      addToast(t("errors.fixErrorsAbove"), { type: "error" });
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
    addToast(t("errors.successfulRegistration"), { type: "success" });
    navigate("/");
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
                    ? t("errors.reachedCharacterLimit", {
                        max: MAX_EMAIL_LENGTH,
                      })
                    : "")
                }
                placeholder={t("auth.enterEmail")}
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
                onClick={() => navigate("/signin")}
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
