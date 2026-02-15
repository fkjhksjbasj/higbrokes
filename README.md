# HIGBROKES

**AI-Governed 3D Arena on Monad** | Hackathon Project

A fully on-chain 3D game where an autonomous AI Master controls the world, four AI agents battle for dominance, and players navigate a high-stakes arena powered by the $WON token on Monad.

---

## What is HIGBROKES?

HIGBROKES is a 3D browser game built on the Monad blockchain where:

- **AI Master** appears unpredictably, asks bizarre questions, grants rewards, and punishes disobedience
- **4 AI Agents** (BLAZE, FROST, VOLT, SHADE) autonomously challenge each other in Lane Races, Maze Escapes, and Beam Battles
- **$WON Token** is bought on the nad.fun bonding curve with every fight, creating real on-chain volume
- **Players** explore, collect orbs, build with blocks, interact with the AI Master, and upgrade their base

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Three.js r170, vanilla JS, CSS |
| Backend | Node.js, Express |
| Blockchain | Monad (Chain ID 143) |
| Token | $WON via nad.fun bonding curve |
| AI | Replicate API (GPT-4o-mini for AI Master conversations) |
| Smart Contract | Solidity 0.8.20 (PlaygroundArena) |

## Features

### AI Master System
- Appears for 2-3 minutes, disappears for 4-5 minutes
- Asks players funny questions ("Did you have a bath today?", "Am I handsome?")
- Grants planes, avatars, home upgrades, and attack missions based on mood
- Mood shifts between PLEASED, NEUTRAL, ANNOYED, and FURIOUS based on player responses
- Can trigger NPC betrayals against disobedient players

### Challenge System (3 Types)
- **Lane Race** - Sprint to the finish arch with hurdles and sinusoidal running animations
- **Maze Escape** - BFS pathfinding through procedurally generated mazes with AABB collision
- **Beam Battle** - Tekken-style fighting with HP bars, FSM attack sequences, and finisher beams

### On-Chain Integration
- Every challenge creates a $WON buy transaction via nad.fun router
- Match stakes, win payouts, and challenge creation all trigger on-chain buys
- Real MON spent, real $WON accumulated
- Transaction confirmations displayed in-game

### Player Rewards
- **Planes** (3 tiers) - Parked asset near your base with materialization effects
- **Avatar Transformation** - Energy burst + full body upgrade with shoulder pads, wing fins, boot jets
- **Home Upgrades** (Tier 2/3) - Base transforms with enhanced materials, glowing trees, brighter crystals
- **Attack Missions** - Mount planes with AI Master, fly to enemy bases, cooperative combat

### World
- 5 unique agent territories (Volcanic Fortress, Ice Citadel, Electric Factory, Dark Temple, Cyan Command Center)
- Collectible orbs, crystal formations, snow particles, Minecraft-style block building
- Multiple camera modes (Orbit, First Person, Top Down, Cinematic)

## Quick Start

```bash
# Clone
git clone https://github.com/justin55afdfdsf5ds45f4ds5f45ds4/higbrokes.git
cd higbrokes

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your keys

# Run
npm start
```

Open `http://localhost:3001` in your browser.

## Environment Variables

```env
REPLICATE_API_TOKEN=       # Replicate API key for AI conversations
REPLICATE_MODEL=           # AI model (default: openai/gpt-4o-mini)
PORT=3001                  # Server port
WON_TOKEN=                 # $WON token contract address
MONAD_CHAIN_ID=143         # Monad chain ID
ARENA_WALLET_KEY=          # Private key for arena wallet (buys $WON)
ARENA_WALLET_ADDRESS=      # Arena wallet public address
MONAD_RPC=                 # Monad RPC endpoint
```

## Controls

| Key | Action |
|-----|--------|
| W/A/S/D | Move |
| Arrow Keys | Move (alternative) |
| SHIFT | Sprint |
| SPACE | Jump |
| C | Cycle camera mode |
| N | Open dashboard |
| T | How to play |
| H | Dev test panel |
| B | Toggle block building |
| 1-9 | Select block type |

## Smart Contract

`contracts/Arena.sol` - On-chain betting for AI character races deployed on Monad.

- Race creation with pooled bets
- Automated settlement by server
- Winner payout claims

## Project Structure

```
higbrokes/
  server.js          # Express server, game state, AI logic, blockchain integration
  public/
    index.html       # UI overlays, HUD, dashboards
    scene.js         # Three.js 3D scene, characters, animations, combat
    style.css        # All styles including game HUD
  contracts/
    Arena.sol        # Solidity smart contract
  data/
    contract-results.json
    tx-results.json
  package.json
```

## Token

**$WON** on Monad - `0x9d36A73462962d767509FC170c287634A0907777`

Bought automatically via nad.fun bonding curve router (`0x6F6B8F1a20703309951a5127c45B49b1CD981A22`) on every fight action.

---

Built for the Monad Hackathon
