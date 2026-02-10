import { useAuth } from "../../context/AuthProvider";
import ChartSwitcher from "../ChartSwitcher/ChartSwitcher";
import style from "./statistics.module.css";
import { posts } from "../../mock/posts";
import { comments } from "../../mock/comments";
import { useState } from "react";
import { LineChartLikes } from "../LineChartLikes/LineChartLikes";
import { BarChartComments } from "../BarChartComments/BarChartComments";
import { commentsData, likesData } from "../../mock/chartData";

export default function Statistics() {
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
          <p className={style.cardTextPrimary}>Posts</p>
          <h1 className={style.cardTitle}>
            {posts.filter((post) => post.authorId === user?.id).length}
          </h1>
          <p className={style.cardTextSecondary}>+40% per month</p>
        </div>
        <div className={style.card}>
          <p className={style.cardTextPrimary}>Likes</p>
          <h1 className={style.cardTitle}>
            {posts
              .filter((post) => post.authorId === user?.id)
              .reduce((sum, el) => sum + el.likes, 0)}
          </h1>
          <p className={style.cardTextSecondary}>+40% per month</p>
        </div>
        <div className={style.card}>
          <p className={style.cardTextPrimary}>Comments</p>
          <h1 className={style.cardTitle}>{postsComments}</h1>
          <p className={style.cardTextSecondary}>+40% per month</p>
        </div>
      </div>

      <div className={style.chartSwitcher}>
        {showChart ? <p className={style.nonVisible}>Table view</p> : null}
        <ChartSwitcher
          isChart={showChart}
          onToggle={() => setShowChart((prev) => !prev)}
        />
        <p>{showChart ? "Chart view" : "Enable Chart view"}</p>
      </div>

      <div className={style.statsTables}>
        <div className={style.likesTable}>
          <p className={style.titleTable}>Likes</p>
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
                  <th className={style.tableTitle}>Title</th>
                  <th />
                  <th />
                </tr>
                <tr>
                  <th className={style.head}>Col 1</th>
                  <th className={style.headRight}>Col 2</th>
                  <th className={style.headRight}>Col 3</th>
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i}>
                    <td className={style.cell}>Row {i + 1}</td>
                    <td className={style.cellRight}>123</td>
                    <td className={style.cellRight}>456</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className={style.likesTable}>
          <p className={style.titleTable}>Comments</p>

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
                  <th className={style.tableTitle}>Title</th>
                  <th />
                  <th />
                </tr>
                <tr>
                  <th className={style.head}>Col 1</th>
                  <th className={style.headRight}>Col 2</th>
                  <th className={style.headRight}>Col 3</th>
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i}>
                    <td className={style.cell}>Row {i + 1}</td>
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
