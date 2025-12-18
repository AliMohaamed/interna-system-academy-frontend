import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  data: { value: number }[]; // Data for the sparkline chart
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  data,
}) => {
  return (
    <Card className="overflow-hidden border-border ">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-foreground">{value}</h3>
              {change && (
                <span
                  className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded-full",
                    changeType === "positive"
                      ? "text-emerald-600 bg-emerald-100/50"
                      : "text-red-600 bg-red-100/50"
                  )}
                >
                  {change}
                </span>
              )}
            </div>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="h-[40px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none" }}
                itemStyle={{ display: "none" }}
                labelStyle={{ display: "none" }}
                cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={changeType === "positive" ? "#10b981" : "#ef4444"} // Emerald-500 or Red-500
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};