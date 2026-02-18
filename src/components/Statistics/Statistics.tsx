import { useAuth } from "../../context/AuthProvider";
import ChartSwitcher from "../ChartSwitcher/ChartSwitcher";
import style from "./statistics.module.css";
import { useState } from "react";
import { LineChartLikes } from "../LineChartLikes/LineChartLikes";
import { BarChartComments } from "../BarChartComments/BarChartComments";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api/axios";

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

export default function Statistics() {
  const { t } = useTranslation();
  const [showChart, setShowChart] = useState(false);
  const { user } = useAuth();

  const { data: userPosts = [], isLoading: postsLoading } = useQuery<
    PostType[]
  >({
    queryKey: ["me", "posts"],
    queryFn: async () => {
      const { data } = await api.get("/api/me/posts");
      return data;
    },
    enabled: !!user,
  });

  const { data: totalLikesCount = 0, isLoading: likesLoading } =
    useQuery<number>({
      queryKey: ["me", "likes", "count"],
      queryFn: async () => {
        const { data } = await api.get("/api/me/likes/count");
        return data.count ?? 0;
      },
      enabled: !!user,
    });

  const { data: totalCommentsCount = 0, isLoading: commentsLoading } =
    useQuery<number>({
      queryKey: ["me", "comments", "count"],
      queryFn: async () => {
        const { data } = await api.get("/api/me/comments/count");
        return data.count ?? 0;
      },
      enabled: !!user,
    });

  const postsCount = userPosts.length;

  const likesChartData = userPosts.slice(0, 7).map((post) => ({
    date: new Date(post.creationDate).toLocaleDateString("en-EN", {
      day: "numeric",
      month: "short",
    }),
    likes: post.likesCount || 0,
  }));

  const commentsChartData = userPosts.slice(0, 7).map((post) => ({
    month: new Date(post.creationDate).toLocaleDateString("en-EN", {
      day: "numeric",
      month: "short",
    }),
    comments: post.commentsCount || 0,
  }));

  const likesTableData = userPosts.slice(0, 7).map((post) => ({
    title: post.title,
    likes: post.likesCount || 0,
    dislikes: 0,
  }));

  const commentsTableData = userPosts.slice(0, 7).map((post) => ({
    title: post.title,
    commentsCount: post.commentsCount || 0,
    totalLikes: 0,
  }));

  const isLoading = postsLoading || likesLoading || commentsLoading;

  return (
    <div className={style.statistics}>
      <div className={style.cards}>
        <div className={style.card}>
          <p className={style.cardTextPrimary}>{t("statistics.posts")}</p>
          <h1 className={style.cardTitle}>{isLoading ? "..." : postsCount}</h1>
          <p className={style.cardTextSecondary}>{t("statistics.perMonth")}</p>
        </div>
        <div className={style.card}>
          <p className={style.cardTextPrimary}>{t("statistics.likes")}</p>
          <h1 className={style.cardTitle}>
            {isLoading ? "..." : totalLikesCount}
          </h1>
          <p className={style.cardTextSecondary}>{t("statistics.perMonth")}</p>
        </div>
        <div className={style.card}>
          <p className={style.cardTextPrimary}>{t("statistics.comments")}</p>
          <h1 className={style.cardTitle}>
            {isLoading ? "..." : totalCommentsCount}
          </h1>
          <p className={style.cardTextSecondary}>{t("statistics.perMonth")}</p>
        </div>
      </div>

      <div className={style.chartSwitcher}>
        {showChart ? (
          <p className={style.nonVisible}>{t("statistics.tableView")}</p>
        ) : null}
        <ChartSwitcher
          isChart={showChart}
          onToggle={() => setShowChart((prev) => !prev)}
        />
        <p>
          {showChart
            ? t("statistics.chartView")
            : t("statistics.enableChartView")}
        </p>
      </div>

      {isLoading ? (
        <p className={style.loading}>{t("common.loading")}...</p>
      ) : (
        <div className={style.statsTables}>
          <div className={style.likesTable}>
            <p className={style.titleTable}>{t("statistics.likes")}</p>
            {showChart ? (
              <div className={style.statsTable}>
                <LineChartLikes data={likesChartData} />
              </div>
            ) : (
              <table className={style.statsTable}>
                <colgroup>
                  <col className={style.colName} />
                  <col className={style.colValue} />
                  <col className={style.colValue} />
                </colgroup>

                <thead>
                  <tr>
                    <th className={style.tableTitle}>
                      {t("statistics.title")}
                    </th>
                    <th />
                    <th />
                  </tr>
                  <tr>
                    <th className={style.head}>{t("statistics.col1")}</th>
                    <th className={style.headRight}>{t("statistics.col2")}</th>
                    <th className={style.headRight}>{t("statistics.col3")}</th>
                  </tr>
                </thead>

                <tbody>
                  {likesTableData.length > 0 ? (
                    likesTableData.map((row, i) => (
                      <tr key={i}>
                        <td className={style.cell}>{row.title}</td>
                        <td className={style.cellRight}>{row.likes}</td>
                        <td className={style.cellRight}>{row.dislikes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className={style.cell} colSpan={3}>
                        {t("statistics.noData")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className={style.likesTable}>
            <p className={style.titleTable}>{t("statistics.comments")}</p>

            {showChart ? (
              <div className={style.statsTable}>
                <BarChartComments data={commentsChartData} />
              </div>
            ) : (
              <table className={style.statsTable}>
                <colgroup>
                  <col className={style.colName} />
                  <col className={style.colValue} />
                  <col className={style.colValue} />
                </colgroup>

                <thead>
                  <tr>
                    <th className={style.tableTitle}>
                      {t("statistics.title")}
                    </th>
                    <th />
                    <th />
                  </tr>
                  <tr>
                    <th className={style.head}>{t("statistics.col1")}</th>
                    <th className={style.headRight}>{t("statistics.col2")}</th>
                    <th className={style.headRight}>{t("statistics.col3")}</th>
                  </tr>
                </thead>

                <tbody>
                  {commentsTableData.length > 0 ? (
                    commentsTableData.map((row, i) => (
                      <tr key={i}>
                        <td className={style.cell}>{row.title}</td>
                        <td className={style.cellRight}>{row.commentsCount}</td>
                        <td className={style.cellRight}>{row.totalLikes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className={style.cell} colSpan={3}>
                        {t("statistics.noData")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
