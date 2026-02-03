import React from "react";
import style from "./sidemenu.module.css";
import { ReactComponent as LogoImg } from "../../assets/images/sidekick_logo.svg";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleAvatarClick() {
    navigate("/profile");
    onClose();
  }
  
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={style.backdrop} onClick={onClose} />

      <aside className={style.menu}>
        <div className={style.menuHeader}>
          <LogoImg
            className={style.menuLogo}
            onClick={() => {
              navigate("/");
              onClose();
            }}
          />
          {isAuthenticated && (
            <img
              onClick={handleAvatarClick}
              alt="avatar"
              src={user?.avatar}
            ></img>
          )}
        </div>

        <div className={style.menuBody}>
          {!isAuthenticated ? (
            <>
              <p
                className={style.menuItem}
                onClick={() => {
                  navigate("/signup");
                  onClose();
                }}
              >
                Sign Up
              </p>
              <p
                className={style.menuItem}
                onClick={() => {
                  navigate("/signin");
                  onClose();
                }}
              >
                Sign In
              </p>
            </>
          ) : (
            <>
              <p
                className={style.menuItem}
                onClick={() => {
                  navigate("/profile");
                  onClose();
                }}
              >
                Profile Info
              </p>
              <p
                className={style.menuItem}
                onClick={() => {
                  navigate("/profile");
                  onClose();
                }}
              >
                Statistics
              </p>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default SideMenu;
