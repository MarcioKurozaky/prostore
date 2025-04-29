"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  LabelList,
} from "recharts";

interface SalesData {
  month: string;
  totalSales: number;
}

interface ChartsProps {
  data: {
    salesData: SalesData[];
  };
}

export default function Charts({ data: { salesData } }: ChartsProps) {
  return (
    <div className="rounded-2xl border bg-background p-4 shadow-sm dark:shadow-none">
      <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
        Monthly Sales Overview
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={salesData} barSize={50}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#CBD5E1"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#CBD5E1"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              border: "1px solid #E5E7EB",
              fontSize: "0.875rem",
            }}
            formatter={(value: number) => [`$${value}`, "Total"]}
          />
          <Bar
            dataKey="totalSales"
            radius={[6, 6, 0, 0]}
            className="fill-primary transition-all duration-300"
          >
            <LabelList
              dataKey="totalSales"
              position="top"
              formatter={(value: number) => `$${value}`}
              className="text-xs text-muted-foreground"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
