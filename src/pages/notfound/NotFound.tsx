import style from "./notfound.module.css";
import { Icon } from "../../components/Icon/Icon";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className={style.container}>
      <section className={style.content}>
        <Icon name="notfound" style={{ width: "160px", height: "160px" }}></Icon>
        <h1 className={style.errorMessage}>{t("errors.pageNotFound")}</h1>
      </section>
    </div>
  );
}
