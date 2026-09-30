"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type TrendPoint = { i: number; date: string; score: number; question: string };

/** Single series (AI score per answer, oldest → newest). Title names the series, so no legend. */
export function ScoreTrend({ data }: { data: TrendPoint[] }) {
  return (
    <figure className="space-y-2">
      <div className="h-56 w-full" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="i"
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(i: number) => data[i]?.date ?? ""}
              minTickGap={24}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                const p = active ? (payload?.[0]?.payload as TrendPoint | undefined) : undefined;
                if (!p) return null;
                return (
                  <div className="bg-popover text-popover-foreground max-w-64 rounded-md border px-3 py-2 text-xs shadow-md">
                    <p className="font-medium">
                      {p.score.toFixed(1)} / 5 · {p.date}
                    </p>
                    <p className="text-muted-foreground mt-0.5 line-clamp-2">{p.question}</p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: "var(--card)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">
        <table>
          <caption>AI feedback score for each answer, oldest first</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Question</th>
              <th>Score out of 5</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.i}>
                <td>{d.date}</td>
                <td>{d.question}</td>
                <td>{d.score.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
