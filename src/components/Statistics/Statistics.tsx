import { useAuth } from "../../context/AuthProvider";
import ChartSwitcher from "../ChartSwitcher/ChartSwitcher";
import style from "./statistics.module.css";
import { posts } from "../../mock/posts";
import { comments } from "../../mock/comments";
import { useState } from "react";
import { LineChartLikes } from "../LineChartLikes/LineChartLikes";
import { BarChartComments } from "../BarChartComments/BarChartComments";
import { commentsData, likesData } from "../../mock/chartData";
import { useTranslation } from "react-i18next";

export default function Statistics() {
  const { t } = useTranslation();
  const [showChart, setShowChart] = useState(false);
  const { user } = useAuth();
  const postsComments = comments.filter((comment) =>
    posts
      .filter((post) => post.authorId === user?.id)
      .includes(posts[comment.postId]),
  ).length;

  return (
    <div className={style.statistics}>
      <div className={style.cards}>
        <div className={style.card}>
          <p className={style.cardTextPrimary}>{t("statistics.posts")}</p>
          <h1 className={style.cardTitle}>
            {posts.filter((post) => post.authorId === user?.id).length}
          </h1>
          <p className={style.cardTextSecondary}>{t("statistics.perMonth")}</p>
        </div>
        <div className={style.card}>
          <p className={style.cardTextPrimary}>{t("statistics.likes")}</p>
          <h1 className={style.cardTitle}>
            {posts
              .filter((post) => post.authorId === user?.id)
              .reduce((sum, el) => sum + el.likes, 0)}
          </h1>
          <p className={style.cardTextSecondary}>{t("statistics.perMonth")}</p>
        </div>
        <div className={style.card}>
          <p className={style.cardTextPrimary}>{t("statistics.comments")}</p>
          <h1 className={style.cardTitle}>{postsComments}</h1>
          <p className={style.cardTextSecondary}>{t("statistics.perMonth")}</p>
        </div>
      </div>

      <div className={style.chartSwitcher}>
        {showChart ? <p className={style.nonVisible}>{t("statistics.tableView")}</p> : null}
        <ChartSwitcher
          isChart={showChart}
          onToggle={() => setShowChart((prev) => !prev)}
        />
        <p>{showChart ? t("statistics.chartView") : t("statistics.enableChartView")}</p>
      </div>

      <div className={style.statsTables}>
        <div className={style.likesTable}>
          <p className={style.titleTable}>{t("statistics.likes")}</p>
          {showChart ? (
            <div className={style.statsTable}>
              <LineChartLikes data={likesData} />
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
                  <th className={style.tableTitle}>{t("statistics.title")}</th>
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
                {Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i}>
                    <td className={style.cell}>{t("statistics.row", { num: i + 1 })}</td>
                    <td className={style.cellRight}>123</td>
                    <td className={style.cellRight}>456</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className={style.likesTable}>
          <p className={style.titleTable}>{t("statistics.comments")}</p>

          {showChart ? (
            <div className={style.statsTable}>
              <BarChartComments data={commentsData} />
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
                  <th className={style.tableTitle}>{t("statistics.title")}</th>
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
                {Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i}>
                    <td className={style.cell}>{t("statistics.row", { num: i + 1 })}</td>
                    <td className={style.cellRight}>123</td>
                    <td className={style.cellRight}>456</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
