import Button from "../Button/Button";
import Input from "../Input/Input";
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

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const isDescriptionMax = values.description.length === 200;

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
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
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

  if (hasError || isDescriptionMax) {
    addToast("Please fix the errors above", { type: "error" });
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
                setFieldValue("username", e.target.value);
                if (errors.username) setFieldError("username", "");
              }}
              value={values.username}
              type="text"
              placeholder={user?.username ?? "@username"}
              status={errors.username ? "error" : "default"}
              errorText={errors.username}
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
                setFieldValue("email", e.target.value);
                if (errors.email) setFieldError("email", "");
              }}
              value={values.email}
              type="text"
              placeholder={user?.email ?? "example@mail.com"}
              status={errors.email ? "error" : "default"}
              errorText={errors.email}
            />
          </div>

          <div className={style.inputBlock}>
            <div className={style.hint}>
              <div className={style.hintContent}>
                <Icon name="pencil" />
                <p>Description</p>
              </div>
            </div>

            <textarea
              className={
                isDescriptionMax ? style.textareaError : style.textarea
              }
              placeholder="Write description here..."
              value={values.description}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= 200) {
                  setFieldValue("description", newValue);
                }
              }}
              rows={4}
              onFocus={() => setDescriptionFocused(true)}
              onBlur={() => setDescriptionFocused(false)}
            />

            {descriptionFocused && (
              <div className={style.validateInfo}>
                {isDescriptionMax ? (
                  <Icon
                    name="info"
                    className="error"
                    style={{ color: "var(--inp-incorrect)" }}
                  />
                ) : (
                  <Icon
                    name="info"
                    style={{ color: "var(--text-secondary)" }}
                  />
                )}
                {isDescriptionMax ? (
                  <p className={style.textareaErrorText}>
                    Reached the 200 text limit
                  </p>
                ) : (
                  <p className={style.secondaryText}>Max 200 chars</p>
                )}
              </div>
            )}
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
