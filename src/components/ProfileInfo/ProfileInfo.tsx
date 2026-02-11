import Button from "../Button/Button";
import Input from "../Input/Input";
import DescriptionTextarea from "../DescriptionTextArea/DescriptionTextArea";
import style from "./profileinfo.module.css";
import { useTheme } from "../../context/ThemeProvider";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

import { useForm } from "../../utils/useForm";
import { validateEmail, validateUsername } from "../../utils/validators";
import { useToast } from "../../context/ToastProvider";
import { Icon } from "../Icon/Icon";

type ProfileFormValues = {
  username: string;
  email: string;
  description: string;
};

export default function ProfileInfo() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const { values, errors, setFieldValue, setFieldError } =
    useForm<ProfileFormValues>({
      username: "",
      email: "",
      description: "",
    });

  const { addToast } = useToast();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_TEXT_LENGTH = 50;

  const isUsernameMax = values.username.length === MAX_TEXT_LENGTH;
  const isEmailMax = values.email.length === MAX_TEXT_LENGTH;

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    e.target.value = "";
  }

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setFieldError("email", "");
    setFieldError("username", "");

    let hasError = false;

    if (values.email.trim() !== "") {
      const emailError = validateEmail(values.email);
      if (emailError) {
        setFieldError("email", emailError);
        hasError = true;
      }
    }

    const usernameError = validateUsername(values.username);
    if (usernameError) {
      setFieldError("username", usernameError);
      hasError = true;
    }

    if (isUsernameMax) {
      hasError = true;
      setFieldError("username", `Cannot exceed ${MAX_TEXT_LENGTH} characters`);
    }

    if (isEmailMax) {
      hasError = true;
      setFieldError("email", `Cannot exceed ${MAX_TEXT_LENGTH} characters`);
    }

    if (values.description.length === 200) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    addToast("Profile info has been updated successfully", { type: "success" });
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className={style.editContent}>
      <form className={style.editProfileForm} onSubmit={handleSubmit}>
        <h1 className={style.title}>Edit profile</h1>

        <div className={style.userMainInfo}>
          <img
            onClick={handleAvatarClick}
            className={style.avatarPicture}
            src={avatarPreview || user?.avatar}
            alt="avatar"
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/svg+xml"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className={style.userMainText}>
            <p className={style.primaryText}>
              {user?.name} {user?.surname}
            </p>
            <p
              style={{ cursor: "pointer" }}
              onClick={handleAvatarClick}
              className={style.secondaryText}
            >
              Change profile photo
            </p>
          </div>
        </div>

        <div className={style.profileInfoBlock}>
          <div className={style.inputBlock}>
            <div className={style.hint}>
              <div className={style.hintContent}>
                <Icon name="user" />
                <p>Username</p>
              </div>
              {errors.username && <Icon name="cross-small" />}
            </div>
            <Input
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_TEXT_LENGTH) {
                  setFieldValue("username", newValue);
                }
                if (errors.username) setFieldError("username", "");
              }}
              value={values.username}
              type="text"
              placeholder={user?.username ?? "@username"}
              status={errors.username || isUsernameMax ? "error" : "default"}
              errorText={
                errors.username ||
                (isUsernameMax
                  ? `Reached the ${MAX_TEXT_LENGTH} character limit`
                  : "")
              }
            />
          </div>

          <div className={style.inputBlock}>
            <div className={style.hint}>
              <div className={style.hintContent}>
                <Icon name="envelope" />
                <p>Email</p>
              </div>
              {errors.email && <Icon name="cross-small" />}
            </div>
            <Input
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= MAX_TEXT_LENGTH) {
                  setFieldValue("email", newValue);
                }
                if (errors.email) setFieldError("email", "");
              }}
              value={values.email}
              type="text"
              placeholder={user?.email ?? "example@mail.com"}
              status={errors.email || isEmailMax ? "error" : "default"}
              errorText={
                errors.email ||
                (isEmailMax
                  ? `Reached the ${MAX_TEXT_LENGTH} character limit`
                  : "")
              }
            />
          </div>

          <div className={style.inputBlock}>
            <div className={style.hint}>
              <div className={style.hintContent}>
                <Icon name="pencil" />
                <p>Description</p>
              </div>
            </div>

            <DescriptionTextarea
              value={values.description}
              onChange={(newValue) => setFieldValue("description", newValue)}
              maxLength={200}
              placeholder="Write description here..."
              textareaClassName={
                values.description.length === 200
                  ? style.textareaError
                  : style.textarea
              }
            />
          </div>
          <Button name="Save Profile Changes" />
        </div>
      </form>

      <div className={style.editPreferencesBlock}>
        <div className={style.editPreferencesItem}>
          <h1 className={style.title}>Preferences</h1>
          <div className={style.themeSwitcher}>
            <ThemeSwitcher />
            <p className={style.primaryText}>
              {theme === "light" ? "Light theme" : "Dark theme"}
            </p>
          </div>
        </div>
        <div className={style.editPreferencesItem}>
          <h1 className={style.title}>Actions</h1>
          <Button name="Logout" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
