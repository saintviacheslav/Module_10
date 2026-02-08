import { useState } from "react";
import style from "./header.module.css";
import SideMenu from "../SideMenu/SideMenu";
import { useAuth } from "../../context/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon/Icon";

function Header() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";

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
          <Icon
            name="logo"
            onClick={handleLogoClick}
            style={{width:"94px", cursor: "pointer" }}
          />
        </div>

        {!isAuthPage && (
          <div
            className={`${style.header_menu} ${
              isAuthenticated ? style.has_LoggedIn : ""
            }`}
          >
            <Icon
              name="burger-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={style.headerMenuBurger}
            />

            <div
              className={`${style.menuContent} 
                        ${menuOpen ? style.open : ""} 
                        ${isAuthenticated ? style.has_LoggedIn : ""}`}
            >
              {isAuthenticated ? (
                <>
                  <img
                    className={style.avatarImg}
                    onClick={handleAvatarClick}
                    alt="avatar"
                    src={user?.avatar}
                  />
                  <p>
                    {user?.name} {user?.surname}
                  </p>
                </>
              ) : (
                <>
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
