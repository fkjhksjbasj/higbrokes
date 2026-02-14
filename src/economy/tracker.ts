import { EconomyMetrics, FeedEntry, AgentState } from '../agents/types';
import { AgentRole, AGENT_ROLES, getAgentAddress } from '../agents/wallets';
import { getBalance } from '../blockchain/monad';

const POVERTY_THRESHOLD = 0.3; // MON

let currentCycleTransactions: { from: AgentRole; to: AgentRole; amount: number }[] = [];
let previousGdp = 0;

export function recordTransaction(from: AgentRole, to: AgentRole, amount: number): void {
  currentCycleTransactions.push({ from, to, amount });
}

export function calculateGini(balances: number[]): number {
  const n = balances.length;
  if (n === 0) return 0;

  const sorted = [...balances].sort((a, b) => a - b);
  const mean = sorted.reduce((s, v) => s + v, 0) / n;
  if (mean === 0) return 0;

  let sumDiffs = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sumDiffs += Math.abs(sorted[i] - sorted[j]);
    }
  }

  return sumDiffs / (2 * n * n * mean);
}

export async function calculateMetrics(cycleNumber: number): Promise<EconomyMetrics> {
  // Get all agent balances
  const balances: number[] = [];
  for (const role of AGENT_ROLES) {
    const bal = parseFloat(await getBalance(getAgentAddress(role)));
    balances.push(bal);
  }

  const totalCirculation = balances.reduce((s, v) => s + v, 0);
  const averageWealth = totalCirculation / balances.length;
  const gdp = currentCycleTransactions.reduce((s, t) => s + t.amount, 0);
  const gdpGrowth = previousGdp > 0 ? ((gdp - previousGdp) / previousGdp) * 100 : 0;
  const gini = calculateGini(balances);
  const activeAgents = new Set([
    ...currentCycleTransactions.map(t => t.from),
    ...currentCycleTransactions.map(t => t.to),
  ]);
  const unemployment = ((AGENT_ROLES.length - activeAgents.size) / AGENT_ROLES.length) * 100;
  const belowPoverty = balances.filter(b => b < POVERTY_THRESHOLD).length;
  const povertyRate = (belowPoverty / balances.length) * 100;

  previousGdp = gdp;

  const metrics: EconomyMetrics = {
    gdp: Math.round(gdp * 10000) / 10000,
    gdpGrowth: Math.round(gdpGrowth * 100) / 100,
    giniCoefficient: Math.round(gini * 1000) / 1000,
    unemployment: Math.round(unemployment * 10) / 10,
    povertyRate: Math.round(povertyRate * 10) / 10,
    corruptionIndex: 0,
    tradeVolume: currentCycleTransactions.length,
    totalCirculation: Math.round(totalCirculation * 10000) / 10000,
    averageWealth: Math.round(averageWealth * 10000) / 10000,
    cycleNumber,
  };

  // Reset cycle transactions
  currentCycleTransactions = [];

  return metrics;
}

export async function getAgentStates(): Promise<AgentState[]> {
  const states: AgentState[] = [];
  for (const role of AGENT_ROLES) {
    const address = getAgentAddress(role);
    const balance = await getBalance(address);
    states.push({
      role,
      address,
      balance,
      totalSent: 0,
      totalReceived: 0,
      lastAction: '',
      lastStatement: '',
    });
  }
  return states;
}
