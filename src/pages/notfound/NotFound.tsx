import style from "./notfound.module.css";
import { Icon } from "../../components/Icon/Icon";

export default function NotFound() {
  return (
    <div className={style.container}>
      <section className={style.content}>
        <Icon name="notfound" style={{ width: "160px", height: "160px" }}></Icon>
        <h1 className={style.error_message}>Page not found</h1>
      </section>
    </div>
  );
}
