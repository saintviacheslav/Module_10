import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";
import { useAuth } from "../../context/AuthProvider";
import Post from "../../components/Post/Post";
import ModalPost from "../../components/ModalPost/ModalPost";
import Button from "../../components/Button/Button";
import { useTranslation } from "react-i18next";
import style from "./main.module.css";
import { getImageUrl } from "../../utils/imageUrl";

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

interface SuggestedUser {
  id: number;
  username: string;
  firstName?: string;
  secondName?: string;
  profileImage?: string;
}

interface SuggestedGroup {
  id: number;
  title: string;
  photo: string;
  membersCount: number;
}

function Main() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorObj,
    refetch: refetchPosts,
  } = useQuery<PostType[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await api.get("/api/posts");
      return data;
    },
    staleTime: 1000 * 60,
  });

  const { data: suggestedUsers = [], isLoading: suggestedLoading } = useQuery<
    SuggestedUser[]
  >({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const { data } = await api.get("/api/getSuggested");
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 300,
  });

  const { data: suggestedGroups = [], isLoading: suggestedGroupsLoading } =
    useQuery<SuggestedGroup[]>({
      queryKey: ["allGroups"],
      queryFn: async () => {
        const { data } = await api.get("/api/groups");
        return data;
      },
      enabled: isAuthenticated,
      staleTime: 1000 * 300,
    });

  return (
    <div className={style.container}>
      <section className={style.content}>
        {isAuthenticated ? (
          <section className={style.postCreation}>
            <div className={style.inputAndAvatar}>
              <img
                src={getImageUrl(user?.profileImage)}
                alt="avatar"
                onError={(e) => (e.currentTarget.src = "avatar.png")}
              />
              <p>{t("main.whatsNew")}</p>
            </div>
            <Button onClick={handleOpenModal} name={t("main.tellEveryone")} />
          </section>
        ) : null}

        <section className={style.feed}>
          {postsLoading ? (
            <div className={style.loading}>{t("main.loading")}...</div>
          ) : postsError ? (
            <div className={style.error}>
              <p>
                {t("main.errorLoadingPosts")}: {postsErrorObj?.message}
              </p>
              <Button
                name={t("common.tryAgain")}
                onClick={() => refetchPosts()}
              />
            </div>
          ) : posts.length === 0 ? (
            <p className={style.emptyFeed}>{t("main.noPostsYet")}</p>
          ) : (
            posts
              .sort(
                (a, b) =>
                  new Date(b.creationDate).getTime() -
                  new Date(a.creationDate).getTime(),
              )
              .map((post) => <Post key={post.id} post={post} />)
          )}
        </section>
      </section>

      {isAuthenticated ? (
        <aside className={style.suggestedArea}>
          <div className={style.suggestedPeople}>
            <p className={style.asideTitle}>{t("main.suggestedPeople")}</p>
            <ul className={style.suggestedList}>
              {suggestedLoading ? (
                <li>{t("main.loading")}...</li>
              ) : suggestedUsers.length === 0 ? (
                <li>{t("main.noSuggestions")}</li>
              ) : (
                suggestedUsers.map((sUser) => (
                  <li key={sUser.id} className={style.suggestedBlock}>
                    <div className={style.miniPerson}>
                      <img
                        className={style.miniPersonAvatar}
                        src={getImageUrl(sUser.profileImage)}
                        alt={sUser.username}
                        onError={(e) => (e.currentTarget.src = "avatar.png")}
                      />
                      <div className={style.miniPersonInfo}>
                        <p className={style.primaryText}>
                          {sUser.firstName} {sUser.secondName || ""}
                        </p>
                        <p className={style.secondaryText}>@{sUser.username}</p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className={style.suggestedCommunity}>
            <p className={style.asideTitle}>{t("main.suggestedCommnity")}</p>
            <ul className={style.suggestedList}>
              {suggestedGroupsLoading ? (
                <li>{t("main.loading")}...</li>
              ) : suggestedGroups.length === 0 ? (
                <li>{t("main.noSuggestions")}</li>
              ) : (
                suggestedGroups.map((sGroup) => (
                  <li key={sGroup.id} className={style.suggestedBlock}>
                    <div className={style.miniPerson}>
                      <img
                        className={style.miniPersonAvatar}
                        src={getImageUrl(sGroup.photo)}
                        alt={sGroup.title}
                        onError={(e) => (e.currentTarget.src = "avatar.png")}
                      />
                      <div className={style.miniPersonInfo}>
                        <p className={style.primaryText}>{sGroup.title}</p>
                        <p className={style.secondaryText}>
                          {sGroup.membersCount} members
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>
      ) : null}

      {isAuthenticated && isModalOpen && (
        <ModalPost isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default Main;
