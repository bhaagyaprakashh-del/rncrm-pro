// Employee KPI Types
export interface EmployeeKPI {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  branch: string;
  period: string; // YYYY-MM format
  targets: KPITarget[];
  achievements: KPIAchievement[];
  overallPerformance: number; // percentage
  totalIncentive: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface KPITarget {
  id: string;
  type: 'leads' | 'tasks' | 'business' | 'collection' | 'group_filling';
  name: string;
  description: string;
  targetValue: number;
  unit: 'count' | 'amount' | 'percentage';
  incentiveAmount: number;
  achievedValue: number;
  achievementPercentage: number;
  incentiveEarned: number;
  status: 'pending' | 'in_progress' | 'achieved' | 'missed';
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface KPIAchievement {
  id: string;
  targetId: string;
  targetType: string;
  value: number;
  date: string;
  description: string;
  verifiedBy?: string;
  verifiedAt?: string;
  source: 'manual' | 'system' | 'integration';
  metadata?: any;
}

export interface KPIIncentive {
  id: string;
  employeeId: string;
  period: string;
  targetType: string;
  targetName: string;
  achievementPercentage: number;
  incentiveAmount: number;
  incentiveType: 'positive' | 'negative';
  status: 'calculated' | 'approved' | 'paid' | 'cancelled';
  payrollRunId?: string;
  calculatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface KPISettings {
  id: string;
  minimumPerformanceThreshold: number; // 50%
  incentiveCalculationMethod: 'linear' | 'tiered' | 'threshold';
  payrollIntegration: boolean;
  autoApproval: boolean;
  penaltyEnabled: boolean;
  maxPenaltyPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeKPIStats {
  totalEmployees: number;
  activeKPIs: number;
  avgPerformance: number;
  totalIncentives: number;
  totalPenalties: number;
  topPerformers: {
    employeeId: string;
    employeeName: string;
    performance: number;
    incentive: number;
  }[];
  underPerformers: {
    employeeId: string;
    employeeName: string;
    performance: number;
    penalty: number;
  }[];
  targetDistribution: {
    leads: number;
    tasks: number;
    business: number;
    collection: number;
    groupFilling: number;
  };
}