import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import style from "./Layout.module.css";

export default function Layout({ centered = true }: { centered?: boolean }) {
  return (
    <div className={style.layout}>
      <Header />
      <main className={`${style.main} ${centered ? style.centered : ""}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
