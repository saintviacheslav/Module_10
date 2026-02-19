import style from "./post.module.css";
import { useAuth } from "../../context/AuthProvider";
import Comment from "../../components/Comment/Comment";
import { SyntheticEvent, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";
import { Icon } from "../../components/Icon/Icon";
import { useToast } from "../../context/ToastProvider";
import { useTranslation } from "react-i18next";
import { getImageUrl } from "../../utils/imageUrl";
import { AxiosError } from "axios";

interface PostProps {
  id: number;
  title: string;
  content: string;
  image?: string;
  authorId: number;
  likesCount: number;
  commentsCount: number;
  creationDate: string;
  modifiedDate?: string;
  likedByUsers?: Array<{ id: number }>;
}

interface UserType {
  id: number;
  username: string;
  firstName?: string;
  secondName?: string;
  profileImage?: string;
}

interface CommentType {
  id: number;
  text: string;
  authorId: number;
  postId: number;
  creationDate: string;
  modifiedDate?: string;
}

export default function Post({ post }: { post: PostProps }) {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: author, isLoading: authorLoading } = useQuery<UserType>({
    queryKey: ["user", post.authorId],
    queryFn: async () => {
      const { data } = await api.get(`/api/users/${post.authorId}`);
      return data;
    },
    enabled: !!post.authorId,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery<
    CommentType[]
  >({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const { data } = await api.get(`/api/posts/${post.id}/comments`);
      return data;
    },
    enabled: isAuthenticated,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => {
      return api.delete(`/api/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      addToast(t("post.commentDeleted"), { type: "success" });
    },
    onError: (err: unknown) => {
      let message = t("post.deleteError");

      if (err instanceof AxiosError && err.response?.data) {
        const serverData = err.response.data as { message?: string };
        if (serverData.message) {
          message = serverData.message;
        }
      }

      addToast(message, { type: "error" });
    },
  });

  const realLikesCount = post.likedByUsers?.length ?? post.likesCount ?? 0;

  const isLikedInitially =
    post.likedByUsers?.some((u) => {
      return u.id === user?.id;
    }) ?? false;

  const [localLikes, setLocalLikes] = useState<number>(realLikesCount);
  const [isLiked, setIsLiked] = useState<boolean>(isLikedInitially);

  const [isCommentsShown, setCommentsShown] = useState<boolean>(false);

  const likeMutation = useMutation({
    mutationFn: () => {
      return api.post("/api/like", { postId: post.id });
    },
    onMutate: () => {
      setLocalLikes((prev) => {
        return prev + 1;
      });
      setIsLiked(true);
    },
    onError: () => {
      setLocalLikes(realLikesCount);
      setIsLiked(isLikedInitially);
      addToast(t("post.likeError"), { type: "error" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: () => {
      return api.post("/api/dislike", { postId: post.id });
    },
    onMutate: () => {
      setLocalLikes((prev) => {
        return prev - 1;
      });
      setIsLiked(false);
    },
    onError: () => {
      setLocalLikes(realLikesCount);
      setIsLiked(isLikedInitially);
      addToast(t("post.dislikeError"), { type: "error" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const toggleComments = () => {
    setCommentsShown((prev) => {
      return !prev;
    });
  };

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      addToast(t("post.loginToLike"), { type: "warning" });
      return;
    }

    if (isLiked) {
      dislikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (!isAuthenticated) {
      return;
    }
    deleteCommentMutation.mutate(commentId);
  };

  const postImageSrc = post.image
    ? typeof post.image === "string" && post.image.startsWith("blob:")
      ? post.image
      : getImageUrl(post.image)
    : null;

  function handleError(e: SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src = "avatar.png";
  }

  function handleErrorMore(e: SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "avatar.png";
  }

  return (
    <div className={style.post}>
      <div className={style.profileinfo}>
        <img
          alt="user avatar"
          className={style.profilephoto}
          src={getImageUrl(author?.profileImage)}
          onError={handleError}
        />
        <div className={style.profiletext}>
          <p className={style.primaryText}>
            {authorLoading
              ? t("post.loading")
              : author
                ? `${author.firstName || ""} ${author.secondName || ""}`.trim() ||
                  author.username
                : t("post.unknown")}
          </p>
          <p className={style.secondaryText}>
            {new Date(post.creationDate).toLocaleString()}
          </p>
        </div>
      </div>

      <div className={style.postContent}>
        {postImageSrc && (
          <img
            alt="post content"
            src={postImageSrc}
            onError={handleErrorMore}
            style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
          />
        )}
        <p className={style.posttext}>{post.content}</p>
      </div>

      <div className={style.interactiveboard}>
        <div className={style.likes}>
          <Icon
            onClick={handleLikeClick}
            name="heart"
            style={{ fill: isLiked ? "var(--inp-incorrect)" : "" }}
          />
          <p>{t("post.likesCount", { count: localLikes })}</p>
        </div>

        <div className={style.comments}>
          <Icon name="comment" />
          {isAuthenticated ? (
            <div className={style.commentDropdown}>
              <p>{t("post.commentsCount", { count: comments.length })}</p>
              <Icon
                name={isCommentsShown ? "arrow-up" : "arrow-down"}
                onClick={toggleComments}
              />
            </div>
          ) : (
            <p>{t("post.loginToComment")}</p>
          )}
        </div>
      </div>

      {isCommentsShown && (
        <ul className={style.commentsList}>
          {commentsLoading ? (
            <li>{t("post.loadingComments")}...</li>
          ) : comments.length === 0 ? null : (
            comments.map((comment, index) => (
              <li key={comment.id || index} className={style.commentsListBlock}>
                <div className={style.commentText}>
                  #{index + 1} {comment.text}
                </div>

                {user?.id === comment.authorId && (
                  <Icon
                    name="trash"
                    onClick={() => {
                      handleDeleteComment(comment.id);
                    }}
                  />
                )}
              </li>
            ))
          )}
        </ul>
      )}

      {isAuthenticated && <Comment postId={post.id} />}
    </div>
  );
}
