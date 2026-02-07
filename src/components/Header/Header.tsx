import React, { useState } from "react";
import style from "./header.module.css";
// import ThemeToggler from "../ThemeToggler/ThemeToggler";
import SideMenu from "../SideMenu/SideMenu";
import { useAuth } from "../../context/AuthProvider";
import { ReactComponent as LogoImg } from "../../assets/images/sidekick_logo.svg";
import { ReactComponent as BurgerMenu } from "../../assets/images/burgermenu.svg";
import { useLocation, useNavigate } from "react-router-dom";
//по контексту отображать разное хэдер меню или его полностью скрывать
//а также на какой странице находимся разная высота у хэдера
function Header() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  function handleLogoClick() {
    navigate("/");
  }
  function handleAvatarClick() {
    navigate("/profile");
  }
  function handleSignUpClick() {
    navigate("/signup");
  }
  function handleSignInClick() {
    navigate("/signin");
  }

  return (
    <>
      <header>

        <div className={style.logo}>
          <LogoImg
            onClick={handleLogoClick}
            style={{ color: "var(--text-primary)", cursor: "pointer" }}
          />
        </div>
        {!isAuthPage && (
          <div
            className={`${style.header_menu} ${isAuthenticated ? style.has_LoggedIn : ""} `}
          >
            <BurgerMenu
              onClick={() => {
                setMenuOpen((prev) => !prev);
              }}
              className={style.headerMenuBurger}
            ></BurgerMenu>
            <div
              className={`${style.menuContent} 
                      ${menuOpen ? style.open : ""} 
                      ${isAuthenticated ? style.has_LoggedIn : ""}`}
            >
              {isAuthenticated ? (
                <>
                  {/* <ThemeToggler /> */}
                  <img
                    className={style.avatarImg}
                    onClick={handleAvatarClick}
                    alt="avatar"
                    src={user?.avatar}
                  ></img>
                  <p>
                    {user?.name} {user?.surname}
                  </p>
                </>
              ) : (
                <>
                  {/* <ThemeToggler /> */}
                  <p
                    className={style.headerMenuText}
                    onClick={handleSignUpClick}
                  >
                    Sign Up
                  </p>
                  <p
                    className={style.headerMenuText}
                    onClick={handleSignInClick}
                  >
                    Sign In
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Header;
