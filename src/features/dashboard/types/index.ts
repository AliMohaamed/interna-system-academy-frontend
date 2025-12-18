// File: src/features/dashboard/types/index.ts

export interface ChartDataPoint {
  value: number; // For Sparklines
}

// 1. KPI Stats
export interface DashboardStat {
  title: string;
  value: string;
  currency?: string;
  change: number;
  changePercentage?: string;
  trend: 'up' | 'down' | 'neutral';
  type: 'students' | 'revenue' | 'conversion' | 'sessions';
  chartData: number[];
}

// 2. Financial Summary
export interface FinancialSummary {
  totalInflow: number;
  totalOutflow: number;
  netProfit: number;
  overdueInstallments: number;
}

// 3. Quick Stats
export interface QuickStats {
  sessionsToday: number;
  pendingTasks: number;
  activeTutors: number;
  newLeadsToday: number;
  lowBalanceStudents: number;
}

// 4. Activity Feed
export interface ActivityUser {
  name: string;
  avatar?: string;
  role: string;
}

export interface Activity {
  id: string;
  user: ActivityUser;
  actionType: 'enrollment' | 'finance' | 'alert' | 'system';
  description: string;
  time: string; // ISO String
  entityId?: string;
  entityType?: string;
}

// 5. Sales Funnel
export interface FunnelStage {
  stage: string;
  count: number;
}

// Main Response Interface
export interface DashboardData {
  period: string;
  stats: DashboardStat[];
  financialSummary: FinancialSummary;
  quickStats: QuickStats;
  recentActivities: Activity[];
  salesFunnel: FunnelStage[];
}