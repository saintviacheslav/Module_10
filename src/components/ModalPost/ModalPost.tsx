import style from "./modalpost.module.css";
import { ReactComponent as MailImg } from "../../assets/images/envelope.svg";
import { ReactComponent as PencilImg } from "../../assets/images/pencil.svg";
import { ReactComponent as InfoImg } from "../../assets/images/info.svg";
import { ReactComponent as FileImg } from "../../assets/images/file-download.svg";
import { ReactComponent as CrossImg } from "../../assets/images/cross.svg";
import { useEffect, useRef, useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { Icon } from "../Icon/Icon";

type ModalPostProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ModalPost({ isOpen, onClose }: ModalPostProps) {
  const [isFocus, setFocus] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [postTitle, setPostTitle] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAreaFocus() {
    setFocus(true);
  }

  function handleAreaBlur() {
    setFocus(false);
  }

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

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setFileError("Invalid file type. Only JPG, PNG, or PDF allowed.");
      return;
    }

    if (file.size > maxSize) {
      setFileError("File too large. Max size: 10MB.");
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

  return (
    <>
      <div className={style.backdrop} onClick={onClose} />
      <div className={style.modalPost}>
        <div className={style.modalHeader}>
          <h1 className={style.modalTitle}>Create a new post</h1>
          <button onClick={onClose} className={style.closeBtn}>
            <Icon name="cross" size={24} style={{color: "var(--text-primary)"}}/>
          </button>
        </div>

        <div className={style.modalMain}>
          <div className={style.inputBlock}>
            <div className={style.hint}>
              <Icon name="envelope" />
              <p>Post Title</p>
            </div>
            <Input
              onChange={(e) => setPostTitle(e.target.value)}
              value={postTitle}
              type="text"
              placeholder="Enter post title"
            />
          </div>
          <div className={style.inputBlock}>
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
              rows={4}
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
                <Icon name="file-download" size={36} style={{ color: "var(--text-primary)" }} />
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
          <Button name="Create" />
        </div>
      </div>
    </>
  );
}
