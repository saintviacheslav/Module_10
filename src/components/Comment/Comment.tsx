import { useState } from "react";
import style from "./comment.module.css";
import Button from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { useToast } from "../../context/ToastProvider";

export default function Comment() {
  const [isFocus, setFocus] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const { addToast } = useToast();

  function handleAreaFocus() {
    setFocus(true);
  }

  function handleAreaBlur() {
    setFocus(false);
  }

  function handleSubmit() {
    if (!description.trim()) {
      addToast("Comment cannot be empty", { type: "error"});
      return;
    }

    if (description.length === 200) {
      addToast("Comment has reached the 200 character limit", { type: "warning" });
      return;
    }

    addToast("Comment added successfully", { type: "success"});

    setDescription("");
    setFocus(false);
  }

  return (
    <>
      <div className={style.adding_comment}>
        <div className={style.hint}>
          <Icon name="pencil"></Icon>
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
              <Icon name="info" style={{ color: "var(--inp-incorrect)" }}></Icon>
            ) : (
              <Icon name="info" style={{ color: "var(--text-secondary)" }}></Icon>
            )}
            {description.length === 200 ? (
              <p className={style.textareaErrorText}>
                Reached the 200 text limit
              </p>
            ) : (
              <p className={style.secondaryText}>Max 200 chars</p>
            )}
          </div>
        )}
        <Button onClick={handleSubmit} name="Add a comment"></Button>
      </div>
    </>
  );
}
