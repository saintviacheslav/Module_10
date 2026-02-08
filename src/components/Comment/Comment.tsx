import React, { useState } from "react";
import style from "./comment.module.css";
import Button from "../Button/Button";
import { ReactComponent as PencilImg } from "../../assets/images/pencil.svg";
import { ReactComponent as InfoImg } from "../../assets/images/info.svg";

export default function Comment() {
  const [isFocus, setFocus] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  function handleAreaFocus() {
    setFocus(true);
  }

  function handleAreaBlur() {
    setFocus(false);
  }
  return (
    <>
      <div className={style.adding_comment}>
        <div className={style.hint}>
          <PencilImg style={{ color: "var(--text-primary)" }}></PencilImg>
          <p>Description</p>
        </div>
        <textarea
          onFocus={handleAreaFocus}
          onBlur={handleAreaBlur}
          className={`${description.length === 200 ? style.textareaError : style.textarea}`}
          placeholder="Write description here..."
          value={description}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length <= 200) {
              setDescription(newValue);
            }
          }}
          rows={2}
        ></textarea>
        {isFocus && (
          <div className={style.validateInfo}>
            {description.length === 200 ? (
              <InfoImg style={{ color: "var(--inp-incorrect)" }}></InfoImg>
            ) : (
              <InfoImg style={{ color: "var(--text-secondary)" }}></InfoImg>
            )}
            {/* <img alt="info"></img> */}
            {description.length === 200 ? (
              <p className={style.textareaErrorText}>
                Reached the 200 text limit
              </p>
            ) : (
              <p className={style.secondaryText}>Max 200 chars</p>
            )}
          </div>
        )}
        <Button name="Add a comment"></Button>
      </div>
    </>
  );
}
