import style from "./modalpost.module.css";
import { Icon } from "../Icon/Icon";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useToast } from "../../context/ToastProvider";
import DescriptionTextarea from "../DescriptionTextArea/DescriptionTextArea";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";
import { AxiosError } from "axios";

type ModalPostProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalPost({ isOpen, onClose }: ModalPostProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [postTitle, setPostTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_TITLE_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  async function uploadImageToServer(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.post("/api/upload-image", formData);
    return data.url;
  }

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const postData: { title: string; content: string; image?: string } = {
        title: postTitle.trim(),
        content: description.trim(),
      };

      if (selectedFile && selectedFile.type.startsWith("image/")) {
        try {
          const uploadedUrl = await uploadImageToServer(selectedFile);
          postData.image = uploadedUrl;
        } catch (err) {
          console.error("Image upload failed:", err);
          throw new Error(t("modalPost.imageUploadFailed"));
        }
      }

      const { data } = await api.post("/api/posts", postData);
      return data;
    },

    onSuccess: (createdPost) => {
      addToast(t("modalPost.postCreated"), { type: "success" });

      const enhancedPost = {
        ...createdPost,
        image: createdPost.image || null,
      };

      queryClient.setQueryData(
        ["posts"],
        (old: { title: string; content: string; image?: string }[] | null) => {
          if (!old) {
            return [enhancedPost];
          }
          return [enhancedPost, ...old];
        },
      );

      setPostTitle("");
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl("");
      setFileError("");

      onClose();
    },

    onError: (err: unknown) => {
      let message = t("modalPost.postCreateError");

      if (err instanceof AxiosError && err.response?.data) {
        const serverMessage = (err.response.data as { message?: string })
          ?.message;
        if (serverMessage) {
          message = serverMessage;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      addToast(message, { type: "error" });
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png"] as const;
    type AllowedFileType = (typeof allowedTypes)[number];
    function isAllowedType(type: string): type is AllowedFileType {
      return allowedTypes.includes(type as AllowedFileType);
    }
    const maxSize = 10 * 1024 * 1024;

    if (!isAllowedType(file.type)) {
      const msg = t("modalPost.invalidFileType");
      setFileError(msg);
      addToast(msg, { type: "error" });
      return;
    }

    if (file.size > maxSize) {
      const msg = t("modalPost.fileTooLarge");
      setFileError(msg);
      addToast(msg, { type: "error" });
      return;
    }

    setFileError("");
    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setPostTitle(newTitle);
    }
  }

  const handleCreatePost = () => {
    if (!postTitle.trim()) {
      addToast(t("modalPost.postTitleEmpty"), { type: "error" });
      return;
    }

    if (postTitle.length >= MAX_TITLE_LENGTH) {
      addToast(t("modalPost.titleTooLong"), { type: "error" });
      return;
    }

    if (!description.trim()) {
      addToast(t("modalPost.descriptionEmpty"), { type: "error" });
      return;
    }

    if (description.length >= MAX_DESCRIPTION_LENGTH) {
      addToast(t("modalPost.descriptionTooLong"), { type: "error" });
      return;
    }

    createPostMutation.mutate();
  };

  const isSubmitting = createPostMutation.isPending;

  return (
    <>
      <div className={style.backdrop} onClick={onClose} />
      <div className={style.modalPost}>
        <div className={style.modalHeader}>
          <h1 className={style.modalTitle}>{t("modalPost.createPost")}</h1>
          <button
            onClick={onClose}
            className={style.closeBtn}
            disabled={isSubmitting}
          >
            <Icon
              name="cross"
              size={24}
              style={{ color: "var(--text-primary)" }}
            />
          </button>
        </div>

        <div className={style.modalMain}>
          <div className={style.inputBlock}>
            <div className={style.hint}>
              <Icon name="envelope" />
              <p>{t("modalPost.postTitle")}</p>
            </div>
            <Input
              onChange={handleChange}
              status={
                postTitle.length === MAX_TITLE_LENGTH ? "error" : "default"
              }
              errorText={t("modalPost.characterLimit", {
                max: MAX_TITLE_LENGTH,
              })}
              value={postTitle}
              type="text"
              placeholder={t("modalPost.postTitlePlaceholder")}
              disabled={isSubmitting}
            />
          </div>

          <div className={style.inputBlock}>
            <div className={style.hint}>
              <Icon name="pencil" />
              <p>{t("profile.description")}</p>
            </div>

            <DescriptionTextarea
              value={description}
              onChange={setDescription}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder={t("profile.writeDescriptionPlaceholder")}
              textareaClassName={
                description.length === MAX_DESCRIPTION_LENGTH
                  ? style.textareaError
                  : style.textarea
              }
            />
          </div>

          <div
            className={style.dropZone}
            onClick={handleZoneClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            {selectedFile ? (
              <div className={style.selectedFile}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={style.previewImage}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "35vh",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <p>{selectedFile.name}</p>
                )}
              </div>
            ) : (
              <>
                <Icon
                  name="file-download"
                  size={36}
                  style={{ color: "var(--text-primary)" }}
                />
                <div className={style.dropInfo}>
                  <p className={style.dropText}>
                    {t("modalPost.selectFileOrDrag")}
                  </p>
                  <p className={style.dropCheck}>
                    {t("modalPost.fileRestrictions")}
                  </p>
                </div>
              </>
            )}
            {fileError && <p className={style.errorText}>{fileError}</p>}
          </div>
        </div>

        <div className={style.dropFooter}>
          <Button
            onClick={handleCreatePost}
            name={
              isSubmitting ? t("modalPost.creating") : t("modalPost.create")
            }
            disabled={isSubmitting}
          />
        </div>
      </div>
    </>
  );
}
