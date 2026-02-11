import style from "./modalpost.module.css";
import { Icon } from "../Icon/Icon";
import { useEffect, useRef, useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useToast } from "../../context/ToastProvider";
import DescriptionTextarea from "../DescriptionTextArea/DescriptionTextArea";

type ModalPostProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalPost({ isOpen, onClose }: ModalPostProps) {
  const [postTitle, setPostTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const MAX_TITLE_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 200;

  useEffect(() => {
    if (!isOpen) return;
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
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setFileError("Invalid file type. Only JPG, PNG, or PDF allowed.");
      addToast("Invalid file type. Only JPG, PNG, or PDF allowed.", {
        type: "error",
      });
      return;
    }

    if (file.size > maxSize) {
      setFileError("File too large. Max size: 10MB.");
      addToast("File too large. Max size: 10MB.", { type: "error" });
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
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreatePost = () => {
    if (!postTitle.trim()) {
      addToast("Post title cannot be empty", { type: "error" });
      return;
    }

    if (postTitle.length === MAX_TITLE_LENGTH) {
      return;
    }

    if (!description.trim()) {
      addToast("Description cannot be empty", { type: "error" });
      return;
    }

    if (description.length === MAX_DESCRIPTION_LENGTH) {
      return;
    }

    addToast("Post created successfully", { type: "success" });

    setPostTitle("");
    setDescription("");
    setSelectedFile(null);
    setPreviewUrl("");
    setFileError("");
    onClose();
  };

  return (
    <>
      <div className={style.backdrop} onClick={onClose} />
      <div className={style.modalPost}>
        <div className={style.modalHeader}>
          <h1 className={style.modalTitle}>Create a new post</h1>
          <button onClick={onClose} className={style.closeBtn}>
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
              <p>Post Title</p>
            </div>
            <Input
              onChange={(e) => {
                const newTitle = e.target.value;
                if (newTitle.length <= MAX_TITLE_LENGTH) {
                  setPostTitle(newTitle);
                }
              }}
              status={
                postTitle.length === MAX_TITLE_LENGTH ? "error" : "default"
              }
              errorText={`Reached the ${MAX_TITLE_LENGTH} character limit`}
              value={postTitle}
              type="text"
              placeholder="Enter post title"
            />
          </div>

          <div className={style.inputBlock}>
            <div className={style.hint}>
              <Icon name="pencil" />
              <p>Description</p>
            </div>

            <DescriptionTextarea
              value={description}
              onChange={setDescription}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder="Write description here..."
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
              accept="image/jpeg,image/png,application/pdf"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
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
                  <p>{selectedFile.name} (PDF)</p>
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
                    Select a file or drag and drop here
                  </p>
                  <p className={style.dropCheck}>
                    JPG, PNG or PDF, file size no more than 10MB
                  </p>
                </div>
              </>
            )}
            {fileError && <p className={style.errorText}>{fileError}</p>}
          </div>
        </div>

        <div className={style.dropFooter}>
          <Button onClick={handleCreatePost} name="Create" />
        </div>
      </div>
    </>
  );
}
