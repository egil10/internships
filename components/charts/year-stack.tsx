"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearStat } from "@/lib/types";

export function YearStack({ data }: { data: YearStat[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={36} />
          <Tooltip
            cursor={{ fill: "rgb(var(--border) / 0.4)" }}
            contentStyle={{
              background: "rgb(var(--surface))",
              border: "1px solid rgb(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "rgb(var(--fg))", fontWeight: 600 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "rgb(var(--muted))" }}
            iconType="circle"
            iconSize={6}
          />
          <Bar
            dataKey="applications"
            stackId="a"
            name="applied"
            fill="rgb(var(--muted) / 0.35)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="interviews"
            stackId="b"
            name="interviews"
            fill="rgb(var(--accent) / 0.45)"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="offers"
            stackId="c"
            name="offers"
            fill="rgb(var(--accent))"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
