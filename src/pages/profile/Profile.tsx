import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import style from "./profile.module.css";
import Input from "../../components/Input/Input";
import { ReactComponent as MailImg } from "../../assets/images/envelope.svg";
import { ReactComponent as PencilImg } from "../../assets/images/pencil.svg";
import { ReactComponent as AvatarImg } from "../../assets/images/user.svg";
import { ReactComponent as InfoImg } from "../../assets/images/info.svg";

import Button from "../../components/Button/Button";
import ThemeToggler from "../../components/ThemeToggler/ThemeToggler";
import { useTheme } from "../../context/ThemeProvider";
import ThemeSwitcher from "../../components/ThemeSwitcher/ThemeSwitcher";

//появляться 

export default function Profile() {
  const [isFocus, setFocus] = useState<boolean>(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isStatistics, setStatistics] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { user, logout } = useAuth();

  function handleAreaFocus(){
    setFocus(true);
  }

  function handleAreaBlur(){
    setFocus(false);
  }

  function handleLogout(){
    logout();
    navigate("/")
  }

  function handleStatisticPress(){
    setStatistics(true)
  }
  function handleProfilePress(){
    setStatistics(false)
  }

  return (
    <section className={style.profileInfo}>
      <div className={style.segmentedControl}>
        <p onClick={handleProfilePress} className={`${style.segmentedText} ${ isStatistics? "" : style.segmentedTextActive}`}>Profile Info</p>
        <p onClick={handleStatisticPress} className={`${style.segmentedText} ${ isStatistics? style.segmentedTextActive: ""}`}>Statistics</p>
      </div>
      <div className={style.editContent}>
        <form className={style.editProfileForm}>
          <h1 className={style.title}>Edit profile</h1>
          <div className={style.userMainInfo}>
            <img className={style.avatarPicture} src={user?.avatar} alt="avatar"></img>
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
              <textarea onFocus={handleAreaFocus} onBlur={handleAreaBlur}
                className={style.textarea}
                placeholder="Write description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              ></textarea>
              {isFocus && <div className={style.validateInfo}>
                <InfoImg></InfoImg>
                {/* <img alt="info"></img> */}
                <p className={style.secondaryText}>Max 200 chars</p>
              </div>}
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
                  {theme === "light"
                    ? "Light theme"
                    : "Dark theme"}
                </p>
            </div>
          </div>
          <div className={style.editPreferencesItem}>
            <h1 className={style.title}>Actions</h1>
            <Button name="Logout" onClick={handleLogout}></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
