import Button from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { useToast } from "../../context/ToastProvider";
import style from "./comment.module.css";
import { useState } from "react";
import DescriptionTextarea from "../DescriptionTextArea/DescriptionTextArea";

export default function Comment() {
  const [description, setDescription] = useState<string>("");
  const { addToast } = useToast();

  function handleSubmit() {
    if (!description.trim()) {
      addToast("Comment cannot be empty", { type: "error" });
      return;
    }

    if (description.length === 200) {
      return;
    }

    addToast("Comment added successfully", { type: "success" });

    setDescription("");
  }

  return (
    <div className={style.adding_comment}>
      <div className={style.hint}>
        <Icon name="pencil" />
        <p>Description</p>
      </div>

      <DescriptionTextarea
        value={description}
        onChange={setDescription}
        maxLength={200}
        placeholder="Write description here..."
      />

      <Button onClick={handleSubmit} name="Add a comment" />
    </div>
  );
}
