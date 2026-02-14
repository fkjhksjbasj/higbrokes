// Real-world economic data (hardcoded with sources)
// These represent current global/US economic indicators for comparison

export interface RealWorldMetrics {
  gdpGrowth: number;
  giniCoefficient: number;
  unemployment: number;
  inflation: number;
  povertyRate: number;
  corruptionIndex: number;
  description: string;
  sources: Record<string, string>;
}

export const REAL_WORLD: RealWorldMetrics = {
  gdpGrowth: 2.5,              // US GDP growth rate (World Bank 2025)
  giniCoefficient: 0.39,        // US Gini index (World Bank)
  unemployment: 4.0,            // US unemployment rate (BLS)
  inflation: 3.1,               // US CPI inflation (BLS)
  povertyRate: 11.5,            // US poverty rate (Census Bureau)
  corruptionIndex: 31,          // Corruption Perceptions Index inverted (Transparency International) — 31% perceived corrupt

  description: 'United States economic indicators (2025)',

  sources: {
    gdpGrowth: 'World Bank, 2025',
    giniCoefficient: 'World Bank, Gini Index',
    unemployment: 'US Bureau of Labor Statistics',
    inflation: 'US Consumer Price Index (CPI)',
    povertyRate: 'US Census Bureau',
    corruptionIndex: 'Transparency International CPI (inverted)',
  },
};

// Provocative comparison points
export const COMPARISON_POINTS = [
  {
    metric: 'Inequality',
    aiLabel: 'Gini Coefficient',
    realWorldFact: 'The top 1% in the US holds more wealth than the bottom 90% combined.',
    aiWorldResponse: 'In Genesis, the Governor redistributes wealth every cycle. No agent is left behind.',
  },
  {
    metric: 'Corruption',
    aiLabel: 'Corruption Index',
    realWorldFact: 'Global corruption costs $2.6 trillion per year — 5% of global GDP.',
    aiWorldResponse: 'In Genesis, every transaction is on-chain. Corruption is mathematically impossible.',
  },
  {
    metric: 'Poverty',
    aiLabel: 'Poverty Rate',
    realWorldFact: '700 million people live in extreme poverty worldwide.',
    aiWorldResponse: 'In Genesis, Universal Basic Income ensures no citizen falls below the poverty line.',
  },
  {
    metric: 'Unemployment',
    aiLabel: 'Employment',
    realWorldFact: '200 million people are unemployed globally despite wanting to work.',
    aiWorldResponse: 'In Genesis, every agent has a productive role. 100% employment by design.',
  },
  {
    metric: 'Banking',
    aiLabel: 'Fair Finance',
    realWorldFact: 'Average US credit card interest rate is 24.7%. Payday loans reach 400% APR.',
    aiWorldResponse: 'In Genesis, the Banker lends at 5% max. No hidden fees. No predatory practices.',
  },
];
