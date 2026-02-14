import { ethers } from 'ethers';
import { config } from '../config';
import { provider } from '../blockchain/monad';

export type AgentRole = 'governor' | 'merchant' | 'builder' | 'banker' | 'worker' | 'philosopher';

export const AGENT_ROLES: AgentRole[] = ['governor', 'merchant', 'builder', 'banker', 'worker', 'philosopher'];

interface AgentWallet {
  role: AgentRole;
  wallet: ethers.Wallet;
  address: string;
}

const agentWallets: Map<AgentRole, AgentWallet> = new Map();

export function initWallets(): void {
  // Generate deterministic wallets from seed
  for (let i = 0; i < AGENT_ROLES.length; i++) {
    const role = AGENT_ROLES[i];
    // Create a deterministic private key from seed + role index
    const seed = config.agentSeed + '_agent_' + i;
    const hash = ethers.id(seed); // keccak256 of the seed string
    const wallet = new ethers.Wallet(hash, provider);

    agentWallets.set(role, {
      role,
      wallet,
      address: wallet.address,
    });
  }
}

export function getAgentWallet(role: AgentRole): ethers.Wallet {
  const aw = agentWallets.get(role);
  if (!aw) throw new Error(`Wallet not initialized for ${role}`);
  return aw.wallet;
}

export function getAgentAddress(role: AgentRole): string {
  const aw = agentWallets.get(role);
  if (!aw) throw new Error(`Wallet not initialized for ${role}`);
  return aw.address;
}

export function getAllAgentAddresses(): Record<AgentRole, string> {
  const result: Record<string, string> = {};
  for (const role of AGENT_ROLES) {
    result[role] = getAgentAddress(role);
  }
  return result as Record<AgentRole, string>;
}

export function getWalletByAddress(address: string): { role: AgentRole; wallet: ethers.Wallet } | null {
  for (const [role, aw] of agentWallets) {
    if (aw.address.toLowerCase() === address.toLowerCase()) {
      return { role, wallet: aw.wallet };
    }
  }
  return null;
}
