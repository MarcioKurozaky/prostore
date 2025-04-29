"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

interface SalesData {
  month: string;
  totalSales: number;
}

interface ChartPieProps {
  data: {
    salesData: SalesData[];
  };
}

const COLORS = [
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#14b8a6",
  "#f43f5e",
  "#8b5cf6",
  "#0ea5e9",
  "#f87171",
  "#22c55e",
];

export default function ChartPie({ data: { salesData } }: ChartPieProps) {
  return (
    <div className="rounded-2xl border bg-background p-4 shadow-sm dark:shadow-none">
      <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
        Monthly Sales Overview
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={salesData}
            dataKey="totalSales"
            nameKey="month"
            cx="50%"
            cy="45%"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={5}
            cornerRadius={8}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={false}
          >
            {salesData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              value="Sales"
              position="center"
              className="text-sm font-semibold text-muted-foreground"
            />
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              border: "1px solid #E5E7EB",
              fontSize: "0.875rem",
            }}
            formatter={(value: number, name: string) => [`$${value}`, name]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
