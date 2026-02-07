import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { month: string; comments: number }[];
}

export function BarChartComments({ data }: Props) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="none"
            stroke="var(--border-soft)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="var(--text-secondary)"
            tick={{
              fill: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 400,
            }}
            axisLine={{ stroke: "var(--border-soft)" }}
            tickLine={false}
          />
          <YAxis
            stroke="var(--text-secondary)"
            tick={{
              fill: "var(--text-secondary)",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 400,
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-soft)",
              borderRadius: "8px",
              color: "var(--text-primary)",
            }}
            labelStyle={{ color: "var(--text-primary)" }}
          />
          <Bar
            dataKey="comments"
            fill="var(--btn-pressed)"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
