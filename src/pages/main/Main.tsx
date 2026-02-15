import { useState } from "react";
import style from "./main.module.css";
import Button from "../../components/Button/Button";
import { useAuth } from "../../context/AuthProvider";
import Post from "../../components/Post/Post";
import ModalPost from "../../components/ModalPost/ModalPost";
import { posts } from "../../mock/posts";
import { useTranslation } from "react-i18next";

function Main() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={style.container}>
      <section className={style.content}>
        {isAuthenticated ? (
          <section className={style.postCreation}>
            <div className={style.inputAndAvatar}>
              <img src="postcreateavatar.png" alt="avatar"></img>
              <p>{t("main.whatsNew")}</p>
            </div>
            <Button onClick={handleOpenModal} name={t("main.tellEveryone")}></Button>
          </section>
        ) : null}
        <section className={style.feed}>
          {posts.map((post) => {
            return <Post key={post.id} post={post}></Post>;
          })}
        </section>
      </section>
      {isAuthenticated ? (
        <aside className={style.suggestedArea}>
          <div className={style.suggestedPeople}>
            <p className={style.asideTitle}>{t("main.suggestedPeople")}</p>
            <ul className={style.suggestedList}>
              <li className={style.suggestedBlock}>
                <div className={style.miniPerson}>
                  <img
                    className={style.miniPersonAvatar}
                    src="avatar.png"
                    alt="mini avatar"
                  ></img>
                  <div className={style.miniPersonInfo}>
                    <p className={style.primaryText}>Helena Hills</p>
                    <p className={style.secondaryText}>@helena</p>
                  </div>
                </div>
              </li>
              <li className={style.suggestedBlock}>
                <div className={style.miniPerson}>
                  <img
                    className={style.miniPersonAvatar}
                    src="avatar.png"
                    alt="mini avatar"
                  ></img>
                  <div className={style.miniPersonInfo}>
                    <p className={style.primaryText}>Helena Hills</p>
                    <p className={style.secondaryText}>@helena</p>
                  </div>
                </div>
              </li>
              <li className={style.suggestedBlock}>
                <div className={style.miniPerson}>
                  <img
                    className={style.miniPersonAvatar}
                    src="avatar.png"
                    alt="mini avatar"
                  ></img>
                  <div className={style.miniPersonInfo}>
                    <p className={style.primaryText}>Helena Hills</p>
                    <p className={style.secondaryText}>@helena</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className={style.suggestedCommunity}>
            <p className={style.asideTitle}>{t("main.suggestedCommnity")}</p>
            <ul className={style.suggestedList}>
              <li className={style.suggestedBlock}>
                <div className={style.miniPerson}>
                  <img
                    className={style.miniPersonAvatar}
                    src="avatar.png"
                    alt="mini avatar"
                  ></img>
                  <div className={style.miniPersonInfo}>
                    <p className={style.primaryText}>Helena Hills</p>
                    <p className={style.secondaryText}>@helena</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      ) : null}
      {isModalOpen && (
        <ModalPost isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Main;
