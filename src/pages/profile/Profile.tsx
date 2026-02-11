import style from "./profile.module.css";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import Statistics from "../../components/Statistics/Statistics";
import { useNavigate } from "react-router-dom";

export default function Profile({ isProfile = true }: { isProfile?: boolean }) {
  const navigate = useNavigate();
  function handleStatisticPress() {
    navigate("/statistics");
  }

  function handleProfilePress() {
    navigate("/profile");
  }

  return (
    <section className={style.profileInfo}>
      <div className={style.segmentedControl}>
        <p
          onClick={handleProfilePress}
          className={`${style.segmentedText} ${!isProfile ? "" : style.segmentedTextActive}`}
        >
          Profile Info
        </p>
        <p
          onClick={handleStatisticPress}
          className={`${style.segmentedText} ${!isProfile ? style.segmentedTextActive : ""}`}
        >
          Statistics
        </p>
      </div>
      {isProfile && <ProfileInfo />}

      {!isProfile && <Statistics />}
    </section>
  );
}
