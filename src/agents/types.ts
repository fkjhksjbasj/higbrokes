import { AgentRole } from './wallets';

export interface AgentAction {
  type: 'transfer' | 'post' | 'analyze';
  to?: AgentRole;
  amount?: string;
  reason: string;
  content?: string;
}

export interface AgentDecision {
  thought: string;
  actions: AgentAction[];
  public_statement: string;
  comparison: string;
}

export interface FeedEntry {
  timestamp: number;
  agent: AgentRole;
  action: string;
  detail: string;
  txHash?: string;
  comparison?: string;
}

export interface AgentState {
  role: AgentRole;
  address: string;
  balance: string;
  totalSent: number;
  totalReceived: number;
  lastAction: string;
  lastStatement: string;
}

export interface EconomyMetrics {
  gdp: number;               // Total MON transacted this cycle
  gdpGrowth: number;         // % change from previous cycle
  giniCoefficient: number;   // 0-1 inequality measure
  unemployment: number;       // % of inactive agents
  povertyRate: number;        // % below threshold
  corruptionIndex: number;    // Always 0
  tradeVolume: number;        // Number of transactions this cycle
  totalCirculation: number;   // Total MON across all agents
  averageWealth: number;      // Mean balance
  cycleNumber: number;
}

export interface CivilizationState {
  agents: AgentState[];
  feed: FeedEntry[];
  metrics: EconomyMetrics;
  metricsHistory: EconomyMetrics[];
  cycleNumber: number;
  startedAt: number;
}
