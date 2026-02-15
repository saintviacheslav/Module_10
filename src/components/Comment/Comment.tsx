import Button from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { useToast } from "../../context/ToastProvider";
import style from "./comment.module.css";
import { useState } from "react";
import DescriptionTextarea from "../DescriptionTextArea/DescriptionTextArea";
import { useTranslation } from "react-i18next";

export default function Comment() {
  const { t } = useTranslation();
  const [description, setDescription] = useState<string>("");
  const { addToast } = useToast();

  function handleSubmit() {
    if (!description.trim()) {
      addToast(t("comment.commentEmpty"), { type: "error" });
      return;
    }

    if (description.length === 200) {
      return;
    }

    addToast(t("comment.commentAdded"), { type: "success" });

    setDescription("");
  }

  return (
    <div className={style.addingComment}>
      <div className={style.hint}>
        <Icon name="pencil" />
        <p>{t("profile.description")}</p>
      </div>

      <DescriptionTextarea
        value={description}
        onChange={setDescription}
        maxLength={200}
        placeholder={t("profile.writeDescriptionPlaceholder")}
      />

      <Button onClick={handleSubmit} name={t("comment.addComment")} />
    </div>
  );
}
