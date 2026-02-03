import React from "react";
import style from "./notfound.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export default function NotFound() {
  return (
      <div className={style.container}>
        <section className={style.content}>
          <img className={style.error_img} src="404.png" alt="404 error"></img>
          <h1 className={style.error_message}>Page not found</h1>
        </section>
      </div>
  );
}
