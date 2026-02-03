import style from "./post.module.css";
import { ReactComponent as Heart } from "../../assets/images/heart.svg";
import { ReactComponent as MessageImg } from "../../assets/images/message.svg";
import { ReactComponent as ArrowDown } from "../../assets/images/arrowdown.svg";
import { ReactComponent as ArrowUp } from "../../assets/images/arrowup.svg";
import { ReactComponent as TrashImg } from "../../assets/images/trash.svg";
import { useAuth } from "../../context/AuthProvider";
import Comment from "../../components/Comment/Comment";
import { useState } from "react";
import { posts } from "../../mock/posts";
import { users } from "../../mock/users";
import { comments } from "../../mock/comments";

interface PostProps{
    id: number;
    authorId: number;
    text: string;
    image: string;
    createdAt: string;
    likes: number;
}


//как получать данные и корректно их подставлять из массива через какие пропсы
export default function Post({ post }: {post: PostProps}){
  const postComments = comments.filter(c => c.postId === post.id);
  const [isShown, setShown] = useState(false);
  const { isAuthenticated, user } = useAuth();
  function changeShownStatus() {
    setShown(!isShown);
  }

  return (
    <div className={style.post}>
            <div className={style.profileinfo}>
              <img
                alt="user avatar"
                className={style.profilephoto}
                src="avatar.png"
              ></img>
              <div className={style.profiletext}>
                <p className={style.primary_text}>{users.find((u) => {return u.id === post?.authorId})?.name}</p>
                <p className={style.secondary_text}>{post?.createdAt}</p>
              </div>
            </div>
            <div className={style.postContent}>
              {post?.image ? <img alt="post content" src={post?.image}></img> : null}
              <p className={style.posttext}>{post?.text}</p>
            </div>
            <div className={style.interactiveboard}>
              <div className={style.likes}>
                <Heart style={{ color: "var(--text-primary)" }} />
                {/* <img alt="like button" src="heart.svg"></img> */}
                <p>{post?.likes} likes</p>
              </div>
              <div className={style.comments}>
                <MessageImg style={{ color: "var(--text-primary)" }} />
                {/* <img alt="comment button" src="message-square.png"></img> */}
                {isAuthenticated ? (
                  <div className={style.comment_dropdown}>
                    <p>{postComments.length} comments</p>
                    {isShown ? (
                      <ArrowUp onClick={changeShownStatus}></ArrowUp>
                    ) : (
                      <ArrowDown onClick={changeShownStatus}></ArrowDown>
                    )}
                    {/* <img
                      onClick={changeShownStatus}
                      src={isShown ? "arrowup.png" : "arrowdown.png"}
                      alt="arrow to hide/find comments"
                    ></img> */}
                  </div>
                ) : (
                  <p>you have to login</p>
                )}
              </div>
            </div>
            {isShown && (
              <ul className={style.comments_list}>
                {postComments.map((comment, index) => {
                  return (
                    <li key={comment.id} className={style.comments_list_block}>
                      #{index+1} {comment.text}
                      {user?.id === comment.authorId ? (
                        <TrashImg
                          onClick={() => {
                              return null;
                            }
                          }
                        ></TrashImg>
                      ) : null}
                    </li>
                  );
                })}
                
              </ul>
            )}
            {isAuthenticated ? <Comment></Comment> : null}
          </div>
  );
}
