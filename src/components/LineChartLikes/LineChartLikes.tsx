import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";

interface Props {
  data: { date: string; likes: number }[];
}

export function LineChartLikes({ data }: Props) {
  const customDot = (props: any) => {
    const { cx, cy, index } = props;

    if (index === data.length - 1) {
      return (
        <Dot
          cx={cx}
          cy={cy}
          r={4}
          fill="var(--text-secondary)"
          stroke="var(--bg-surface)"
          strokeWidth={2}
        />
      );
    }

    return null;
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="none"
            stroke="var(--border-soft)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
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
            tickFormatter={(val) => `${val}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-soft)",
              borderRadius: "8px",
              color: "var(--text-primary)",
            }}
            labelStyle={{ color: "var(--text-primary)" }}
            itemStyle={{ color: "var(--text-primary)" }}
          />
          <Line
            type="monotone"
            dataKey="likes"
            stroke="var(--btn-pressed)"
            strokeWidth={2}
            dot={customDot}
            activeDot={{
              r: 8,
              stroke: "var(--text-primary)",
              strokeWidth: 2,
              fill: "var(--bg-surface)",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
