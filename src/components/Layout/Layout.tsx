import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import style from "./Layout.module.css";

const shouldCenterMain = (pathname: string) =>
  pathname !== "/" && !pathname.startsWith("/profile");

export default function Layout() {
  const { pathname } = useLocation();
  const centered = shouldCenterMain(pathname);

  return (
    <div className={style.layout}>
      <Header />
      <main
        data-testid="layout-main"
        className={`${style.main} ${centered ? style.centered : ""}`}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
