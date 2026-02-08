import style from "./post.module.css";
import { useAuth } from "../../context/AuthProvider";
import Comment from "../../components/Comment/Comment";
import { useState } from "react";
import { users } from "../../mock/users";
import { comments } from "../../mock/comments";
import { Icon } from "../../components/Icon/Icon";

interface PostProps {
  id: number;
  authorId: number;
  text: string;
  image: string;
  createdAt: string;
  likes: number;
}

export default function Post({ post }: { post: PostProps }) {
  const postComments = comments.filter((c) => c.postId === post.id);
  const [isShown, setShown] = useState(false);
  const { isAuthenticated, user } = useAuth();

  function changeShownStatus() {
    setShown(!isShown);
  }

  const author = users.find((u) => u.id === post.authorId);

  return (
    <div className={style.post}>
      <div className={style.profileinfo}>
        <img
          alt="user avatar"
          className={style.profilephoto}
          src={author?.avatar || "default-avatar.png"}
        />
        <div className={style.profiletext}>
          <p className={style.primary_text}>{author?.name || "Unknown"}</p>
          <p className={style.secondary_text}>{post.createdAt}</p>
        </div>
      </div>

      <div className={style.postContent}>
        {post.image ? <img alt="post content" src={post.image} /> : null}
        <p className={style.posttext}>{post.text}</p>
      </div>

      <div className={style.interactiveboard}>
        <div className={style.likes}>
          <Icon name="heart" />
          <p>{post.likes} likes</p>
        </div>

        <div className={style.comments}>
          <Icon name="comment" />
          {isAuthenticated ? (
            <div className={style.commentDropdown}>
              <p>{postComments.length} comments</p>
              <Icon
                name={isShown ? "arrow-up" : "arrow-down"}
                onClick={changeShownStatus}
              />
            </div>
          ) : (
            <p>You have to login to write comments</p>
          )}
        </div>
      </div>

      {isShown && (
        <ul className={style.commentsList}>
          {postComments.map((comment, index) => (
            <li key={comment.id} className={style.commentsListBlock}>
              #{index + 1} {comment.text}
              {user?.id === comment.authorId && (
                <Icon
                  name="trash"
                  onClick={() => {
                    return null;
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated && <Comment />}
    </div>
  );
}
