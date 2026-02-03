import React, { useState } from "react";
import style from "./main.module.css";
import Button from "../../components/Button/Button";
import Comment from "../../components/Comment/Comment";
import Input from "../../components/Input/Input";
import { ReactComponent as Heart } from "../../assets/images/heart.svg";
import { ReactComponent as MessageImg } from "../../assets/images/message.svg";
import { ReactComponent as ArrowDown } from "../../assets/images/arrowdown.svg";
import { ReactComponent as ArrowUp } from "../../assets/images/arrowup.svg";
import { ReactComponent as TrashImg } from "../../assets/images/trash.svg";
import { useAuth } from "../../context/AuthProvider";
import Post from "../../components/Post/Post"
import { posts } from "../../mock/posts";
function Main() {
  const users = [
    {
      id: 1,
      name: "john",
      surname: "sin",
      username: "@ltth",
      description: "lalalla",
    },
  ];
  const [isShown, setShown] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(true);
  const { isAuthenticated, user } = useAuth();

  function changeLoggedStatus() {
    setLoggedIn(!isLoggedIn);
    console.log(isLoggedIn);
  }
  function changeShownStatus() {
    setShown(!isShown);
  }
  return (
    <div className={style.container}>
      <section className={style.content}>
        {isAuthenticated ? (
          <section className={style.post_creation}>
            <div className={style.input_and_avatar}>
              <img src="postcreateavatar.png" alt="avatar"></img>
              <p>What's new?</p>
            </div>
            <Button name="Tell everyone"></Button>
          </section>
        ) : null}
        <section className={style.feed}>
          {posts.map((post) => {
            return (
              <Post key={post.id} post={post}></Post>
            );
          })}
        </section>
      </section>
      {isAuthenticated ? (
        <aside className={style.suggested_area}>
          <div className={style.suggested_people}>
            <p className={style.aside_title}>Suggested people</p>
            <ul className={style.suggested_list}>
              <li className={style.suggested_block}>
                <div className={style.mini_person}>
                  <img
                    className={style.mini_person_avatar}
                    src="avatar.png"
                    alt="mini avatar"
                  ></img>
                  <div className={style.mini_person_info}>
                    <p className={style.primary_text}>Helena Hills</p>
                    <p className={style.secondary_text}>@helena</p>
                  </div>
                </div>
              </li>
              <li className={style.suggested_block}>
                <div className={style.mini_person}>
                  <img
                    className={style.mini_person_avatar}
                    src="avatar.png"
                    alt="mini avatar"
                  ></img>
                  <div className={style.mini_person_info}>
                    <p className={style.primary_text}>Helena Hills</p>
                    <p className={style.secondary_text}>@helena</p>
                  </div>
                </div>
              </li>
              <li className={style.suggested_block}>
                <div className={style.mini_person}>
                  <img
                    className={style.mini_person_avatar}
                    src="avatar.png"
                    alt="mini avatar"
                  ></img>
                  <div className={style.mini_person_info}>
                    <p className={style.primary_text}>Helena Hills</p>
                    <p className={style.secondary_text}>@helena</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className={style.suggested_community}>
            <p className={style.aside_title}>Communities you might like</p>
            <ul className={style.suggested_list}>
              <li className={style.suggested_block}>
                <div className={style.mini_person}>
                  <img
                    className={style.mini_person_avatar}
                    src="avatar.png"
                    alt="mini avatar"
                  ></img>
                  <div className={style.mini_person_info}>
                    <p className={style.primary_text}>Helena Hills</p>
                    <p className={style.secondary_text}>@helena</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

export default Main;
