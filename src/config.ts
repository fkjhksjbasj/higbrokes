import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // LLM
  llmProvider: process.env.LLM_PROVIDER || 'replicate',
  replicateApiKey: process.env.REPLICATE_API_KEY || '',
  replicateModel: process.env.REPLICATE_MODEL || 'openai/gpt-4o-mini',

  // Monad
  monadRpcUrl: process.env.MONAD_RPC_URL || 'https://monad-mainnet.drpc.org',
  funderPrivateKey: process.env.FUNDER_PRIVATE_KEY || '',

  // Agent wallets seed
  agentSeed: process.env.AGENT_SEED || 'genesis_civilization_monad_ultra_2026',

  // Social
  moltbookApiKey: process.env.MOLTBOOK_API_KEY || '',

  // Config
  cycleIntervalMs: parseInt(process.env.CYCLE_INTERVAL_MS || '600000'), // 10 min
  port: parseInt(process.env.PORT || '3000'),
};
