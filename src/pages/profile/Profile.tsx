import { useEffect, useState } from "react";
import style from "./profile.module.css";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import Statistics from "../../components/Statistics/Statistics";
import { useNavigate } from "react-router-dom";

//появляться

export default function Profile({ isProfile = true }: { isProfile?: boolean }) {
  const navigate = useNavigate();
  const [isStatistics, setStatistics] = useState<boolean | null>(null);

  useEffect(() => {
    setStatistics(!isProfile);
  }, [isProfile]);

  function handleStatisticPress() {
    setStatistics(true);
    navigate("/statistics");
  }

  function handleProfilePress() {
    setStatistics(false);
    navigate("/profile");
  }

  return (
    <section className={style.profileInfo}>
      <div className={style.segmentedControl}>
        <p
          onClick={handleProfilePress}
          className={`${style.segmentedText} ${isStatistics ? "" : style.segmentedTextActive}`}
        >
          Profile Info
        </p>
        <p
          onClick={handleStatisticPress}
          className={`${style.segmentedText} ${isStatistics ? style.segmentedTextActive : ""}`}
        >
          Statistics
        </p>
      </div>
      {!isStatistics && <ProfileInfo />}

      {isStatistics && <Statistics />}
    </section>
  );
}
