import { ethers } from 'ethers';
import { config } from '../config';

export const CHAIN_ID = 143;
export const EXPLORER_URL = 'https://explorer.monad.xyz';

export const provider = new ethers.JsonRpcProvider(config.monadRpcUrl);

export const funderWallet = new ethers.Wallet(config.funderPrivateKey, provider);

export function txLink(hash: string): string {
  return `${EXPLORER_URL}/tx/${hash}`;
}

export function addressLink(addr: string): string {
  return `${EXPLORER_URL}/address/${addr}`;
}

export async function getBalance(address: string): Promise<string> {
  const bal = await provider.getBalance(address);
  return ethers.formatEther(bal);
}

export async function transferMON(
  fromWallet: ethers.Wallet,
  toAddress: string,
  amountMON: string
): Promise<string> {
  const tx = await fromWallet.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(amountMON),
  });

  // Monad can have "Unknown block" on fast confirmation — retry wait
  try {
    const receipt = await tx.wait();
    return receipt!.hash;
  } catch (err: any) {
    if (err.message?.includes('Unknown block') || err.code === 'UNKNOWN_ERROR') {
      // TX was likely sent, just wait a bit and return the hash
      await new Promise(r => setTimeout(r, 3000));
      return tx.hash;
    }
    throw err;
  }
}
