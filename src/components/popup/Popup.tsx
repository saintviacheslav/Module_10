import style from "./popup.module.css";

export default function Popup() {
  return (
    <div className={style.popupNotification}>
      <p className={style.popupText}></p>
    </div>
  );
}
