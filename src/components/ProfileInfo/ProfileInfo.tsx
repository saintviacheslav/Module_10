import Button from "../Button/Button";
import Input from "../Input/Input";
import DescriptionTextarea from "../DescriptionTextArea/DescriptionTextArea";
import style from "./profileinfo.module.css";
import { useTheme } from "../../context/ThemeProvider";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

import { useForm } from "../../utils/useForm";
import { validateEmail, validateUsername } from "../../utils/validators";
import { useToast } from "../../context/ToastProvider";
import { Icon } from "../Icon/Icon";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";
import { AxiosError } from "axios";
import { getImageUrl } from "../../utils/imageUrl";

type ProfileFormValues = {
  username: string;
  email: string;
  description: string;
};

export default function ProfileInfo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { values, errors, setFieldValue, setFieldError } =
    useForm<ProfileFormValues>({
      username: "",
      email: "",
      description: "",
    });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_TEXT_LENGTH = 50;

  const isUsernameMax = values.username.length === MAX_TEXT_LENGTH;
  const isEmailMax = values.email.length === MAX_TEXT_LENGTH;

  const { data: profileData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get("/api/me");
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    const source = profileData || user;
    if (source?.profileImage) {
      setAvatarPreview(getImageUrl(source.profileImage));
    }

    setIsInitialized(true);
  }, [profileData, user, isInitialized]);

  const hasChanges =
    values.username.trim() !== "" ||
    values.email.trim() !== "" ||
    values.description.trim() !== "" ||
    avatarFile !== null;

  async function uploadImageToServer(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post("/api/upload-image", formData);

    return data.url;
  }

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const updateData: Partial<{
        username: string;
        email: string;
        description: string;
        profileImage: string;
      }> = {};

      if (values.username.trim()) {
        updateData.username = values.username.trim();
      }
      if (values.email.trim()) {
        updateData.email = values.email.trim();
      }
      if (values.description.trim()) {
        updateData.description = values.description.trim();
      }

      if (avatarFile) {
        try {
          const uploadedUrl = await uploadImageToServer(avatarFile);
          updateData.profileImage = uploadedUrl;
        } catch (err) {
          console.error("Image upload failed:", err);
          throw new Error(t("profile.imageUploadFailed"));
        }
      }

      const { data } = await api.put("/api/profile", updateData);

      return data;
    },

    onSuccess: (updatedUser) => {
      addToast(t("profile.profileUpdated"), { type: "success" });

      updateUser(updatedUser);

      queryClient.setQueryData(["me"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["me"] });

      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }

      setAvatarFile(null);

      if (updatedUser.profileImage) {
        setAvatarPreview(getImageUrl(updatedUser.profileImage));
      }

      setFieldValue("username", "");
      setFieldValue("email", "");
      setFieldValue("description", "");
    },

    onError: (err: unknown) => {
      let message = t("profile.updateError");

      if (err instanceof AxiosError && err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      console.error("Profile update error:", err);
      addToast(message, { type: "error" });
    },
  });

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
      addToast(t("profile.invalidAvatarType"), { type: "error" });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      addToast(t("profile.fileTooLarge"), { type: "error" });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setAvatarFile(file);
    e.target.value = "";
  }

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
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
      const emailError = validateEmail(values.email, t);
      if (emailError) {
        setFieldError("email", emailError);
        hasError = true;
      }
    }

    if (values.username.trim() !== "") {
      const usernameError = validateUsername(values.username, t);
      if (usernameError) {
        setFieldError("username", usernameError);
        hasError = true;
      }
    }

    if (isUsernameMax) {
      hasError = true;
      setFieldError(
        "username",
        t("errors.usernameMaxLength", { max: MAX_TEXT_LENGTH }),
      );
    }

    if (isEmailMax) {
      hasError = true;
      setFieldError(
        "email",
        t("errors.emailMaxLength", { max: MAX_TEXT_LENGTH }),
      );
    }

    if (values.description.length === 200) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    updateProfileMutation.mutate();
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleChangeUsername(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    if (newValue.length <= MAX_TEXT_LENGTH) {
      setFieldValue("username", newValue);
    }
    if (errors.username) {
      setFieldError("username", "");
    }
  }
  function handleChangeEmail(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    if (newValue.length <= MAX_TEXT_LENGTH) {
      setFieldValue("email", newValue);
    }
    if (errors.email) {
      setFieldError("email", "");
    }
  }

  return (
    <div className={style.editContent}>
      <form className={style.editProfileForm} onSubmit={handleSubmit}>
        <h1 className={style.title}>{t("profile.editProfile")}</h1>

        <div className={style.userMainInfo}>
          <img
            onClick={handleAvatarClick}
            className={style.avatarPicture}
            src={
              avatarPreview || getImageUrl(user?.profileImage) || "avatar.png"
            }
            alt="avatar"
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/svg+xml"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={updateProfileMutation.isPending}
          />
          <div className={style.userMainText}>
            <p className={style.primaryText}>
              {user?.firstName} {user?.secondName}
            </p>
            <p
              style={{ cursor: "pointer" }}
              onClick={handleAvatarClick}
              className={style.secondaryText}
            >
              {t("profile.changeProfilePhoto")}
            </p>
          </div>
        </div>

        <div className={style.profileInfoBlock}>
          <div className={style.inputBlock}>
            <div className={style.hint}>
              <div className={style.hintContent}>
                <Icon name="user" />
                <p>{t("profile.username")}</p>
              </div>
              {errors.username && <Icon name="cross-small" />}
            </div>
            <Input
              onChange={handleChangeUsername}
              value={values.username}
              type="text"
              placeholder={user?.username ?? "@username"}
              status={errors.username || isUsernameMax ? "error" : "default"}
              errorText={
                errors.username ||
                (isUsernameMax
                  ? t("modalPost.characterLimit", { max: MAX_TEXT_LENGTH })
                  : "")
              }
              disabled={updateProfileMutation.isPending}
            />
          </div>

          <div className={style.inputBlock}>
            <div className={style.hint}>
              <div className={style.hintContent}>
                <Icon name="envelope" />
                <p>{t("auth.email")}</p>
              </div>
              {errors.email && <Icon name="cross-small" />}
            </div>
            <Input
              onChange={handleChangeEmail}
              value={values.email}
              type="text"
              placeholder={user?.email ?? "example@mail.com"}
              status={errors.email || isEmailMax ? "error" : "default"}
              errorText={
                errors.email ||
                (isEmailMax
                  ? t("modalPost.characterLimit", { max: MAX_TEXT_LENGTH })
                  : "")
              }
              disabled={updateProfileMutation.isPending}
            />
          </div>

          <div className={style.inputBlock}>
            <div className={style.hint}>
              <div className={style.hintContent}>
                <Icon name="pencil" />
                <p>{t("profile.description")}</p>
              </div>
            </div>

            <DescriptionTextarea
              value={values.description}
              onChange={(newValue) => {
                setFieldValue("description", newValue);
              }}
              maxLength={200}
              placeholder={t("profile.writeDescriptionPlaceholder")}
              textareaClassName={
                values.description.length === 200
                  ? style.textareaError
                  : style.textarea
              }
            />
          </div>
          <Button
            name={
              updateProfileMutation.isPending
                ? t("profile.saving")
                : t("profile.saveProfileChanges")
            }
            disabled={updateProfileMutation.isPending || !hasChanges}
          />
        </div>
      </form>

      <div className={style.editPreferencesBlock}>
        <div className={style.editPreferencesItem}>
          <h1 className={style.title}>{t("common.preferences")}</h1>
          <div className={style.themeSwitcher}>
            <ThemeSwitcher />
            <p className={style.primaryText}>
              {theme === "light" ? t("theme.light") : t("theme.dark")}
            </p>
          </div>
          <div className={style.languageSwitcher}>
            <LanguageSwitcher />
            <p className={style.primaryText}>{t("common.language")}</p>
          </div>
        </div>
        <div className={style.editPreferencesItem}>
          <h1 className={style.title}>{t("common.actions")}</h1>
          <Button name={t("common.logout")} onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
