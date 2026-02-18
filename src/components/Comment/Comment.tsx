import Button from "../Button/Button";
import { Icon } from "../Icon/Icon";
import { useToast } from "../../context/ToastProvider";
import style from "./comment.module.css";
import { useState } from "react";
import DescriptionTextarea from "../DescriptionTextArea/DescriptionTextArea";
import { useTranslation } from "react-i18next";
import { api } from "../../lib/api/axios";
import { useAuth } from "../../context/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface CommentProps {
  postId: number;
}

interface NewCommentResponse {
  id: number;
  text: string;
  authorId: number;
  postId: number;
  creationDate: string;
  modifiedDate?: string;
}

interface PostType {
  id: number;
  title: string;
  content: string;
  image?: string;
  authorId: number;
  likesCount: number;
  commentsCount: number;
  creationDate: string;
}

export default function Comment({ postId }: CommentProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [description, setDescription] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const { data } = await api.post<NewCommentResponse>("/api/comments", {
        postId,
        text: text.trim(),
      });
      return data;
    },

    onMutate: async (text) => {
      const previousComments = queryClient.getQueryData<NewCommentResponse[]>([
        "comments",
        postId,
      ]);

      const optimisticComment: NewCommentResponse = {
        id: Date.now(),
        text,
        authorId: user?.id ?? 0,
        postId,
        creationDate: new Date().toISOString(),
      };

      queryClient.setQueryData<NewCommentResponse[]>(
        ["comments", postId],
        (old = []) => [...old, optimisticComment],
      );

      queryClient.setQueryData<PostType[]>(["posts"], (oldPosts = []) =>
        oldPosts.map((p) =>
          p.id === postId
            ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 }
            : p,
        ),
      );

      return { previousComments };
    },

    onError: (
      err: unknown,
      _newComment: string,
      context?: { previousComments?: CommentProps[] },
    ) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments,
        );
      }

      let message = t("comment.commentError");

      if (err instanceof AxiosError && err.response?.data) {
        const serverData = err.response.data as { message?: string };
        if (serverData.message) {
          message = serverData.message;
        }
      }

      addToast(message, { type: "error" });
    },

    onSuccess: (newComment) => {
      queryClient.setQueryData<NewCommentResponse[]>(
        ["comments", postId],
        (old = []) =>
          old.map((c) =>
            c.id < 0 || typeof c.id === "string" ? newComment : c,
          ),
      );

      addToast(t("comment.commentAdded"), { type: "success" });
      setDescription("");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = () => {
    if (!description.trim()) {
      addToast(t("comment.commentEmpty"), { type: "error" });
      return;
    }

    if (description.length >= 200) {
      return;
    }

    if (!user) {
      addToast(t("comment.loginRequired"), { type: "warning" });
      return;
    }

    mutation.mutate(description);
  };

  return (
    <div className={style.addingComment}>
      <div className={style.hint}>
        <Icon name="pencil" />
        <p>{t("comment.addComment")}</p>
      </div>

      <DescriptionTextarea
        value={description}
        onChange={setDescription}
        maxLength={200}
        placeholder={t("comment.writeCommentPlaceholder")}
      />

      <Button
        onClick={handleSubmit}
        name={
          mutation.isPending ? t("comment.sending") : t("comment.addComment")
        }
        disabled={mutation.isPending || !description.trim()}
      />
    </div>
  );
}
