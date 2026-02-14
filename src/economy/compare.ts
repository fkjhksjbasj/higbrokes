import { EconomyMetrics } from '../agents/types';
import { REAL_WORLD, COMPARISON_POINTS, RealWorldMetrics } from './realworld';

export interface ComparisonData {
  aiWorld: EconomyMetrics | null;
  realWorld: RealWorldMetrics;
  comparisons: Array<{
    metric: string;
    aiValue: string;
    realValue: string;
    aiWins: boolean;
    insight: string;
  }>;
  provocativeQuestion: string;
  comparisonPoints: typeof COMPARISON_POINTS;
}

let latestMetrics: EconomyMetrics | null = null;

export function updateMetrics(metrics: EconomyMetrics): void {
  latestMetrics = metrics;
}

export function getComparison(): ComparisonData {
  const comparisons = [];

  if (latestMetrics) {
    comparisons.push({
      metric: 'GDP Growth',
      aiValue: `${latestMetrics.gdpGrowth > 0 ? '+' : ''}${latestMetrics.gdpGrowth}%`,
      realValue: `+${REAL_WORLD.gdpGrowth}%`,
      aiWins: latestMetrics.gdpGrowth > REAL_WORLD.gdpGrowth,
      insight: latestMetrics.gdpGrowth > REAL_WORLD.gdpGrowth
        ? 'AI economy growing faster than the real world'
        : 'Still building momentum',
    });

    comparisons.push({
      metric: 'Inequality (Gini)',
      aiValue: latestMetrics.giniCoefficient.toFixed(3),
      realValue: REAL_WORLD.giniCoefficient.toFixed(3),
      aiWins: latestMetrics.giniCoefficient < REAL_WORLD.giniCoefficient,
      insight: latestMetrics.giniCoefficient < REAL_WORLD.giniCoefficient
        ? 'AI civilization is more equal than the US'
        : 'Redistribution still in progress',
    });

    comparisons.push({
      metric: 'Unemployment',
      aiValue: `${latestMetrics.unemployment}%`,
      realValue: `${REAL_WORLD.unemployment}%`,
      aiWins: latestMetrics.unemployment < REAL_WORLD.unemployment,
      insight: latestMetrics.unemployment === 0
        ? 'Full employment — every agent has a productive role'
        : `${latestMetrics.unemployment}% inactive this cycle`,
    });

    comparisons.push({
      metric: 'Poverty Rate',
      aiValue: `${latestMetrics.povertyRate}%`,
      realValue: `${REAL_WORLD.povertyRate}%`,
      aiWins: latestMetrics.povertyRate < REAL_WORLD.povertyRate,
      insight: latestMetrics.povertyRate === 0
        ? 'UBI eliminated poverty entirely'
        : 'Governor is addressing poverty through redistribution',
    });

    comparisons.push({
      metric: 'Corruption',
      aiValue: `${latestMetrics.corruptionIndex}%`,
      realValue: `${REAL_WORLD.corruptionIndex}%`,
      aiWins: true,
      insight: 'Every transaction is on-chain. Corruption is impossible by design.',
    });
  }

  const questions = [
    'Same economic structure. Same roles. Same challenges. But the AI world is more prosperous. Why?',
    'What if corruption was impossible? What if every transaction was transparent?',
    'The AI world has zero poverty. The real world has 700 million in extreme poverty. What\'s different?',
    'No hidden fees. No predatory loans. No wage theft. Is fairness really that hard?',
    'If transparent governance works here, why doesn\'t it work in the real world?',
  ];

  return {
    aiWorld: latestMetrics,
    realWorld: REAL_WORLD,
    comparisons,
    provocativeQuestion: questions[latestMetrics ? latestMetrics.cycleNumber % questions.length : 0],
    comparisonPoints: COMPARISON_POINTS,
  };
}
