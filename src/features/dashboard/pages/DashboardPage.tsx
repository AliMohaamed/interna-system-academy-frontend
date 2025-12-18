import  { useEffect, useState } from "react";
import { 
  Users, TrendingUp, Loader2, AlertCircle, 
  Wallet, ArrowUpRight, ArrowDownRight, AlertTriangle, 
  CheckCircle2, UserPlus, Banknote, Server
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell 
} from "recharts";

import { StatsCard } from "../components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { dashboardService } from "../services/dashboardService";
import type { DashboardData } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Helper: Format Currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// Helper: Get Icon based on Activity Type
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'enrollment': return <UserPlus className="h-4 w-4 text-blue-500" />;
    case 'finance': return <Banknote className="h-4 w-4 text-emerald-500" />;
    case 'alert': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'system': return <Server className="h-4 w-4 text-slate-500" />;
    default: return <CheckCircle2 className="h-4 w-4 text-slate-500" />;
  }
};

// Helper: Parse bold text in description "**text**" -> <b>text</b>
const renderDescription = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={index} className="font-bold text-foreground">{part.slice(2, -2)}</span>;
    }
    return part;
  });
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await dashboardService.getSummary();
        setData(dashboardData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
        toast.error("Could not load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (error || !data) return <div className="flex h-[50vh] flex-col items-center justify-center gap-4"><AlertCircle className="h-12 w-12 text-destructive" /><p>{error}</p><Button onClick={() => window.location.reload()}>Retry</Button></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <p>Overview for period:</p>
          <Badge variant="outline" className="bg-muted/50">{data.period}</Badge>
        </div>
      </div>

      {/* 1. KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={`${stat.currency ? stat.currency + ' ' : ''}${stat.value}`}
              change={stat.changePercentage} // Using percentage from backend
              changeType={stat.trend === 'up' ? "positive" : stat.trend === 'down' ? "negative" : "neutral"}
              icon={stat.type === 'revenue' ? Wallet : stat.type === 'conversion' ? TrendingUp : Users}
              data={stat.chartData.map(val => ({ value: val }))}
            />
        ))}
      </div>

      {/* 2. Financial & Sales Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        
        {/* Financial Pulse (1 Column) */}
        <Card className="col-span-1 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Financial Pulse</CardTitle>
            <CardDescription>Cash flow summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* Net Profit */}
             <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-600"><Wallet className="h-4 w-4" /></div>
                    <span className="text-sm font-medium">Net Profit</span>
                </div>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(data.financialSummary.netProfit)}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-emerald-500" /> Inflow</p>
                    <p className="font-semibold">{formatCurrency(data.financialSummary.totalInflow)}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><ArrowDownRight className="h-3 w-3 text-red-500" /> Outflow</p>
                    <p className="font-semibold">{formatCurrency(data.financialSummary.totalOutflow)}</p>
                </div>
             </div>

             {/* Overdue Alert */}
             {data.financialSummary.overdueInstallments > 0 && (
                 <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <span className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Overdue
                    </span>
                    <span className="font-bold text-red-700 dark:text-red-400">{formatCurrency(data.financialSummary.overdueInstallments)}</span>
                 </div>
             )}
          </CardContent>
        </Card>

        {/* Sales Funnel Chart (2 Columns) */}
        <Card className="col-span-1 lg:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Sales Funnel</CardTitle>
            <CardDescription>Conversion from leads to students</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.salesFunnel} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="stage" type="category" width={100} tick={{fontSize: 12}} />
                    <RechartsTooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                        {data.salesFunnel.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={['#94a3b8', '#60a5fa', '#3b82f6', '#22c55e'][index % 4]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Activity & Operations Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        
        {/* Recent Activity Feed (4 cols) */}
        <Card className="lg:col-span-4 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                {data.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0 relative">
                    <Avatar className="h-10 w-10 border border-border mt-1">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    {/* Activity Icon Badge */}
                    <div className="absolute left-7 top-7 bg-background rounded-full p-0.5 border border-border">
                        {getActivityIcon(activity.actionType)}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-foreground">
                            {activity.user.name} <span className="text-muted-foreground font-normal text-xs">({activity.user.role})</span>
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                          </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {renderDescription(activity.description)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Operational Quick Stats (3 cols) */}
        <Card className="lg:col-span-3 border-border shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Operations Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuickStatRow label="Sessions Scheduled" value={String(data.quickStats.sessionsToday)} />
            <QuickStatRow label="Active Tutors" value={String(data.quickStats.activeTutors)} />
            <QuickStatRow label="New Leads" value={String(data.quickStats.newLeadsToday)} highlight />
            <QuickStatRow label="Pending Tasks" value={String(data.quickStats.pendingTasks)} />
            
            {data.quickStats.lowBalanceStudents > 0 && (
                 <div className="mt-4 p-3 bg-amber-500/10 rounded-md border border-amber-500/20 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <div>
                        <p className="text-sm font-bold text-amber-700 dark:text-amber-500">{data.quickStats.lowBalanceStudents} Students</p>
                        <p className="text-xs text-amber-600/80">Have low balance. Action required.</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto h-7 text-xs border-amber-500/30 text-amber-700">View</Button>
                 </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// Sub-component for rows
function QuickStatRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-between p-3 rounded-lg transition-colors border border-transparent",
            highlight ? "bg-primary/5 border-primary/10" : "hover:bg-muted/50 border-border/40"
        )}>
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
            <span className={cn("text-base font-bold", highlight ? "text-primary" : "text-foreground")}>{value}</span>
        </div>
    )
}