import { EmployeeKPI, KPITarget, KPIAchievement, KPIIncentive } from '../types/kpi';
import { getEmployees } from './employees.mock';

export const mockEmployeeKPIs: EmployeeKPI[] = [
  {
    id: 'kpi_1',
    employeeId: 'emp_1',
    employeeName: 'Priya Sharma',
    department: 'Sales & Marketing',
    branch: 'Bangalore Main',
    period: '2024-03',
    targets: [
      {
        id: 'target_1_1',
        type: 'leads',
        name: 'Monthly Lead Generation',
        description: 'Generate new leads for chit fund schemes',
        targetValue: 50,
        unit: 'count',
        incentiveAmount: 15000,
        achievedValue: 42,
        achievementPercentage: 84,
        incentiveEarned: 12600,
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      },
      {
        id: 'target_1_2',
        type: 'tasks',
        name: 'Task Completion',
        description: 'Complete assigned tasks on time',
        targetValue: 30,
        unit: 'count',
        incentiveAmount: 8000,
        achievedValue: 28,
        achievementPercentage: 93.3,
        incentiveEarned: 7464,
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      },
      {
        id: 'target_1_3',
        type: 'business',
        name: 'Lead Conversion Value',
        description: 'Convert leads to subscribers with minimum value',
        targetValue: 2000000,
        unit: 'amount',
        incentiveAmount: 25000,
        achievedValue: 1650000,
        achievementPercentage: 82.5,
        incentiveEarned: 20625,
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      },
      {
        id: 'target_1_4',
        type: 'collection',
        name: 'Payment Collection',
        description: 'Collect payments from assigned customers',
        targetValue: 1500000,
        unit: 'amount',
        incentiveAmount: 20000,
        achievedValue: 1320000,
        achievementPercentage: 88,
        incentiveEarned: 17600,
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      },
      {
        id: 'target_1_5',
        type: 'group_filling',
        name: 'Group Ticket Filling',
        description: 'Fill vacant tickets in assigned chit groups',
        targetValue: 15,
        unit: 'count',
        incentiveAmount: 12000,
        achievedValue: 12,
        achievementPercentage: 80,
        incentiveEarned: 9600,
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      }
    ],
    achievements: [
      {
        id: 'ach_1_1',
        targetId: 'target_1_1',
        targetType: 'leads',
        value: 8,
        date: '2024-03-15',
        description: 'Generated 8 new leads from website and referrals',
        verifiedBy: 'Rajesh Kumar',
        verifiedAt: '2024-03-15T16:00:00',
        source: 'manual'
      },
      {
        id: 'ach_1_2',
        targetId: 'target_1_3',
        targetType: 'business',
        value: 350000,
        date: '2024-03-14',
        description: 'Converted TechCorp lead to subscriber - ₹3.5L value',
        verifiedBy: 'Rajesh Kumar',
        verifiedAt: '2024-03-14T14:30:00',
        source: 'system'
      }
    ],
    overallPerformance: 85.6,
    totalIncentive: 67889,
    status: 'active',
    createdAt: '2024-03-01',
    createdBy: 'rajesh.kumar@ramnirmalchits.com',
    updatedAt: '2024-03-15',
    updatedBy: 'priya.sharma@ramnirmalchits.com',
    approvedBy: 'rajesh.kumar@ramnirmalchits.com',
    approvedAt: '2024-03-01T10:00:00',
    notes: 'Strong performance across all targets, on track for full incentive'
  },
  {
    id: 'kpi_2',
    employeeId: 'emp_2',
    employeeName: 'Karthik Nair',
    department: 'Operations',
    branch: 'Bangalore South',
    period: '2024-03',
    targets: [
      {
        id: 'target_2_1',
        type: 'leads',
        name: 'Monthly Lead Generation',
        description: 'Generate new leads for chit fund schemes',
        targetValue: 30,
        unit: 'count',
        incentiveAmount: 10000,
        achievedValue: 18,
        achievementPercentage: 60,
        incentiveEarned: 6000,
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      },
      {
        id: 'target_2_2',
        type: 'tasks',
        name: 'Task Completion',
        description: 'Complete assigned operational tasks',
        targetValue: 40,
        unit: 'count',
        incentiveAmount: 12000,
        achievedValue: 15,
        achievementPercentage: 37.5,
        incentiveEarned: -4500, // Penalty for under 50%
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      },
      {
        id: 'target_2_3',
        type: 'collection',
        name: 'Payment Collection',
        description: 'Collect overdue payments from members',
        targetValue: 800000,
        unit: 'amount',
        incentiveAmount: 15000,
        achievedValue: 520000,
        achievementPercentage: 65,
        incentiveEarned: 9750,
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      },
      {
        id: 'target_2_4',
        type: 'group_filling',
        name: 'Group Management',
        description: 'Manage and fill chit group tickets',
        targetValue: 20,
        unit: 'count',
        incentiveAmount: 18000,
        achievedValue: 8,
        achievementPercentage: 40,
        incentiveEarned: -7200, // Penalty for under 50%
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      }
    ],
    achievements: [
      {
        id: 'ach_2_1',
        targetId: 'target_2_1',
        targetType: 'leads',
        value: 6,
        date: '2024-03-12',
        description: 'Generated 6 leads through referral program',
        verifiedBy: 'Rajesh Kumar',
        verifiedAt: '2024-03-12T15:00:00',
        source: 'manual'
      }
    ],
    overallPerformance: 51.6,
    totalIncentive: 4050, // Net positive after penalties
    status: 'active',
    createdAt: '2024-03-01',
    createdBy: 'rajesh.kumar@ramnirmalchits.com',
    updatedAt: '2024-03-15',
    updatedBy: 'karthik.nair@ramnirmalchits.com',
    approvedBy: 'rajesh.kumar@ramnirmalchits.com',
    approvedAt: '2024-03-01T10:00:00',
    notes: 'Performance below expectations in tasks and group management'
  },
  {
    id: 'kpi_3',
    employeeId: 'emp_3',
    employeeName: 'Neha Singh',
    department: 'Customer Service',
    branch: 'Bangalore East',
    period: '2024-03',
    targets: [
      {
        id: 'target_3_1',
        type: 'tasks',
        name: 'Customer Service Tasks',
        description: 'Handle customer queries and support tickets',
        targetValue: 100,
        unit: 'count',
        incentiveAmount: 8000,
        achievedValue: 125,
        achievementPercentage: 125,
        incentiveEarned: 10000, // Bonus for exceeding 100%
        status: 'achieved',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      },
      {
        id: 'target_3_2',
        type: 'leads',
        name: 'Lead Support & Qualification',
        description: 'Support sales team with lead qualification',
        targetValue: 25,
        unit: 'count',
        incentiveAmount: 6000,
        achievedValue: 22,
        achievementPercentage: 88,
        incentiveEarned: 5280,
        status: 'in_progress',
        deadline: '2024-03-31',
        createdAt: '2024-03-01',
        updatedAt: '2024-03-15'
      }
    ],
    achievements: [
      {
        id: 'ach_3_1',
        targetId: 'target_3_1',
        targetType: 'tasks',
        value: 35,
        date: '2024-03-15',
        description: 'Resolved 35 customer support tickets',
        verifiedBy: 'Vikram Singh',
        verifiedAt: '2024-03-15T17:00:00',
        source: 'system'
      }
    ],
    overallPerformance: 106.5,
    totalIncentive: 15280,
    status: 'active',
    createdAt: '2024-03-01',
    createdBy: 'vikram.singh@ramnirmalchits.com',
    updatedAt: '2024-03-15',
    updatedBy: 'neha.singh@ramnirmalchits.com',
    approvedBy: 'vikram.singh@ramnirmalchits.com',
    approvedAt: '2024-03-01T10:00:00',
    notes: 'Excellent performance, exceeding targets consistently'
  }
];

export const getEmployeeKPIs = (): EmployeeKPI[] => {
  const saved = localStorage.getItem('employee_kpis');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockEmployeeKPIs;
    } catch (error) {
      console.error('Failed to load employee KPIs:', error);
      return mockEmployeeKPIs;
    }
  }
  return mockEmployeeKPIs;
};

export const saveEmployeeKPIs = (kpis: EmployeeKPI[]) => {
  try {
    localStorage.setItem('employee_kpis', JSON.stringify(kpis));
    window.dispatchEvent(new CustomEvent('kpisUpdated'));
  } catch (error) {
    console.error('Failed to save employee KPIs:', error);
  }
};

export const getKPIByEmployeeAndPeriod = (employeeId: string, period: string): EmployeeKPI | undefined => {
  return getEmployeeKPIs().find(kpi => kpi.employeeId === employeeId && kpi.period === period);
};

export const calculateKPIIncentives = (kpi: EmployeeKPI): KPIIncentive[] => {
  const incentives: KPIIncentive[] = [];
  const minimumThreshold = 50; // 50% minimum performance

  kpi.targets.forEach(target => {
    let incentiveAmount = 0;
    let incentiveType: 'positive' | 'negative' = 'positive';

    if (target.achievementPercentage >= minimumThreshold) {
      // Positive incentive - proportional to achievement
      incentiveAmount = (target.incentiveAmount * target.achievementPercentage) / 100;
      incentiveType = 'positive';
    } else {
      // Negative incentive (penalty) for under 50%
      const penaltyPercentage = minimumThreshold - target.achievementPercentage;
      incentiveAmount = (target.incentiveAmount * penaltyPercentage) / 100;
      incentiveType = 'negative';
    }

    incentives.push({
      id: `incentive_${target.id}`,
      employeeId: kpi.employeeId,
      period: kpi.period,
      targetType: target.type,
      targetName: target.name,
      achievementPercentage: target.achievementPercentage,
      incentiveAmount,
      incentiveType,
      status: 'calculated',
      calculatedAt: new Date().toISOString(),
      notes: `${incentiveType === 'positive' ? 'Incentive' : 'Penalty'} for ${target.achievementPercentage}% achievement`
    });
  });

  return incentives;
};

export const updateKPIAchievement = (
  employeeId: string, 
  period: string, 
  targetType: string, 
  value: number, 
  description: string
) => {
  const kpis = getEmployeeKPIs();
  const kpiIndex = kpis.findIndex(k => k.employeeId === employeeId && k.period === period);
  
  if (kpiIndex === -1) return;

  const kpi = kpis[kpiIndex];
  const targetIndex = kpi.targets.findIndex(t => t.type === targetType);
  
  if (targetIndex === -1) return;

  // Update achievement
  kpi.targets[targetIndex].achievedValue += value;
  kpi.targets[targetIndex].achievementPercentage = 
    (kpi.targets[targetIndex].achievedValue / kpi.targets[targetIndex].targetValue) * 100;
  
  // Recalculate incentive
  const achievement = kpi.targets[targetIndex].achievementPercentage;
  if (achievement >= 50) {
    kpi.targets[targetIndex].incentiveEarned = 
      (kpi.targets[targetIndex].incentiveAmount * achievement) / 100;
  } else {
    kpi.targets[targetIndex].incentiveEarned = 
      -((kpi.targets[targetIndex].incentiveAmount * (50 - achievement)) / 100);
  }

  // Update status
  if (achievement >= 100) {
    kpi.targets[targetIndex].status = 'achieved';
  } else if (achievement > 0) {
    kpi.targets[targetIndex].status = 'in_progress';
  }

  // Add achievement record
  const newAchievement: KPIAchievement = {
    id: `ach_${Date.now()}`,
    targetId: kpi.targets[targetIndex].id,
    targetType,
    value,
    date: new Date().toISOString().split('T')[0],
    description,
    source: 'manual'
  };
  
  kpi.achievements.push(newAchievement);

  // Recalculate overall performance
  const totalTargets = kpi.targets.length;
  const totalPerformance = kpi.targets.reduce((sum, t) => sum + t.achievementPercentage, 0);
  kpi.overallPerformance = totalPerformance / totalTargets;

  // Recalculate total incentive
  kpi.totalIncentive = kpi.targets.reduce((sum, t) => sum + t.incentiveEarned, 0);

  kpi.updatedAt = new Date().toISOString();
  kpi.updatedBy = 'system@ramnirmalchits.com';

  kpis[kpiIndex] = kpi;
  saveEmployeeKPIs(kpis);
  
  return kpi;
};

export const initializeKPIData = () => {
  try {
    const existingKPIs = getEmployeeKPIs();
    if (existingKPIs.length === 0) {
      saveEmployeeKPIs(mockEmployeeKPIs);
    }
  } catch (error) {
    console.error('Error initializing KPI data:', error);
    saveEmployeeKPIs(mockEmployeeKPIs);
  }
};