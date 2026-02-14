import express from 'express';
import path from 'path';
import { config } from './config';
import { getState, getFeed } from './agents/engine';
import { getComparison } from './economy/compare';
import { AGENT_ROLES, getAgentAddress } from './agents/wallets';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API: Full civilization state
app.get('/api/status', (_req, res) => {
  try {
    const state = getState();
    res.json(state);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: Economy comparison (AI vs Real World)
app.get('/api/economy', (_req, res) => {
  try {
    const comparison = getComparison();
    res.json(comparison);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: Agent list with balances
app.get('/api/agents', async (_req, res) => {
  try {
    const state = getState();
    res.json(state.agents);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: Live activity feed
app.get('/api/feed', (_req, res) => {
  try {
    const feed = getFeed();
    res.json(feed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API: Agent addresses (for wallet donations)
app.get('/api/addresses', (_req, res) => {
  const addresses: Record<string, string> = {};
  for (const role of AGENT_ROLES) {
    addresses[role] = getAgentAddress(role);
  }
  res.json(addresses);
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'alive', civilization: 'GENESIS', uptime: process.uptime() });
});

export function startServer(): void {
  app.listen(config.port, () => {
    console.log(`[SERVER] GENESIS dashboard live at http://localhost:${config.port}`);
  });
}
