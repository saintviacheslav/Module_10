import React, { useEffect } from "react";
import style from "./sidemenu.module.css";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Icon } from "../Icon/Icon";
import { useTranslation } from "react-i18next";

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

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
          <Icon name="logo"
            size={48}
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
              src={`${process.env.PUBLIC_URL}/${user?.avatar}`}
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
                {t("common.signUp")}
              </p>
              <p
                className={style.menuItem}
                onClick={() => {
                  navigate("/signin");
                  onClose();
                }}
              >
                {t("common.signIn")}
              </p>
            </>
          ) : (
            <>
              <p
                className={style.menuItem}
                onClick={() => {
                  navigate("/profile/info");
                  onClose();
                }}
              >
                {t("common.profileInfo")}
              </p>
              <p
                className={style.menuItem}
                onClick={() => {
                  navigate("/profile/statistics");
                  onClose();
                }}
              >
                {t("common.statistics")}
              </p>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default SideMenu;
