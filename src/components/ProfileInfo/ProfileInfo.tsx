import Button from "../Button/Button";
import Input from "../Input/Input";
import style from "./profileinfo.module.css";
import { ReactComponent as MailImg } from "../../assets/images/envelope.svg";
import { ReactComponent as PencilImg } from "../../assets/images/pencil.svg";
import { ReactComponent as AvatarImg } from "../../assets/images/user.svg";
import { ReactComponent as InfoImg } from "../../assets/images/info.svg";
import { useTheme } from "../../context/ThemeProvider";
import { FormEvent, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

export default function ProfileInfo() {
  const navigate = useNavigate();
  const [isMore, setMore] = useState<boolean>(false);
  const [isFocus, setFocus] = useState<boolean>(false);
  const { theme } = useTheme();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const { user, logout } = useAuth();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setEmailError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Email is not valid");
      return;
    }
  }

  function handleAreaFocus() {
    setFocus(true);
  }

  function handleAreaBlur() {
    setFocus(false);
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
            className={style.avatarPicture}
            src={user?.avatar}
            alt="avatar"
          ></img>
          <div className={style.userMainText}>
            <p className={style.primaryText}>
              {user?.name} {user?.surname}
            </p>
            <p className={style.secondaryText}>Change profile photo</p>
          </div>
        </div>
        <div className={style.profileInfoBlock}>
          <div className={style.inputBlock}>
            <div className={style.hint}>
              <AvatarImg style={{ color: "var(--text-primary)" }} />
              {/* <img
                  className={style.hint_img}
                  src="envelope.png"
                  alt="mail"
                ></img> */}
              <p>Username</p>
            </div>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              placeholder={user?.username}
            />
          </div>
          <div className={style.inputBlock}>
            <div className={style.hint}>
              <MailImg style={{ color: "var(--text-primary)" }}></MailImg>
              {/* <img
                  className={style.hint_img}
                  src="envelope.png"
                  alt="mail"
                ></img> */}
              <p>Email</p>
            </div>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder={user?.email}
              status={emailError ? "error" : "default"}
              errorText={emailError}
            />
          </div>
          <div className={style.inputBlock}>
            <div className={style.hint}>
              <PencilImg style={{ color: "var(--text-primary)" }}></PencilImg>
              {/* <img
                  className={style.hint_img}
                  src="envelope.png"
                  alt="mail"
                ></img> */}
              <p>Description</p>
            </div>
            <textarea
              onFocus={handleAreaFocus}
              onBlur={handleAreaBlur}
              className={`${description.length === 200 ? style.textareaError : style.textarea}`}
              placeholder="Write description here..."
              value={description}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue.length <= 200) {
                  setDescription(newValue);
                }
              }}
              rows={4}
            ></textarea>
            {isFocus && (
              <div className={style.validateInfo}>
                {description.length === 200 ? (
                  <InfoImg style={{ color: "var(--inp-incorrect)" }}></InfoImg>
                ) : (
                  <InfoImg style={{ color: "var(--text-secondary)" }}></InfoImg>
                )}
                {/* <img alt="info"></img> */}
                {description.length === 200 ? (
                  <p className={style.textareaErrorText}>
                    Reached the 200 text limit
                  </p>
                ) : (
                  <p className={style.secondaryText}>Max 200 chars</p>
                )}
              </div>
            )}
          </div>
          <Button name="Save Profile Changes"></Button>
        </div>
      </form>
      <div className={style.editPreferencesBlock}>
        <div className={style.editPreferencesItem}>
          <h1 className={style.title}>Preferences</h1>
          <div className={style.themeSwitcher}>
            <ThemeSwitcher />
            {/* <ThemeToggler /> */}
            <p className={style.primaryText}>
              {theme === "light" ? "Light theme" : "Dark theme"}
            </p>
          </div>
        </div>
        <div className={style.editPreferencesItem}>
          <h1 className={style.title}>Actions</h1>
          <Button name="Logout" onClick={handleLogout}></Button>
        </div>
      </div>
    </div>
  );
}
