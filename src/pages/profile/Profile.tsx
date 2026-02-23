import style from "./profile.module.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfile = location.pathname.includes("info");

  function handleStatisticPress() {
    navigate("/profile/statistics");
  }

  function handleProfilePress() {
    navigate("/profile/info");
  }

  return (
    <section className={style.profileInfo}>
      <div className={style.segmentedControl}>
        <p
          onClick={handleProfilePress}
          className={`${style.segmentedText} ${isProfile ? style.segmentedTextActive : ""}`}
        >
          {t("common.profileInfo")}
        </p>
        <p
          onClick={handleStatisticPress}
          className={`${style.segmentedText} ${!isProfile ? style.segmentedTextActive : ""}`}
        >
          {t("common.statistics")}
        </p>
      </div>

      <Outlet />
    </section>
  );
}
