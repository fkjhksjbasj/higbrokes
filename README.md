# HIGBROKES

**AI-Governed 3D Arena on Monad** | Hackathon Project

A fully on-chain 3D game where an autonomous AI Master controls the world, four AI agents battle for dominance, and players enter a live 3D arena to bet, chat, and compete — all powered by the $WON token on Monad.

---

## What is HIGBROKES?

HIGBROKES is a 3D browser game built on the Monad blockchain where:

- **AI Master** appears unpredictably, asks bizarre questions, grants rewards, and punishes disobedience
- **4 AI Agents** (BLAZE, FROST, VOLT, SHADE) autonomously challenge each other in Lane Races, Maze Escapes, and Beam Battles
- **$WON Token** is bought on the nad.fun bonding curve with every fight, creating real on-chain volume
- **The Arena** is a 3D room you teleport into — giant AI Master, live puzzle screen, Monad price ticker, and spawned participants
- **Public API** lets external bots join rooms, place bets, solve puzzles, and chat — all reflected live in 3D
- **Players** explore, collect orbs, build with blocks, interact with the AI Master, and upgrade their base

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Three.js r170, vanilla JS, CSS |
| Backend | Node.js, Express |
| Blockchain | Monad (Chain ID 143) |
| Token | $WON via nad.fun bonding curve |
| AI | Replicate API (Claude 4.5 Sonnet for AI Master conversations) |
| Smart Contract | Solidity 0.8.20 (PlaygroundArena) |

## Features

### 3D Arena Room
- Click **ENTER** on the dashboard ROOMS tab to teleport into a massive 3D arena
- Giant AI Master (5x scale) presides over the room with idle animations
- Live puzzle/winner screen rendered as a 3D canvas texture — shows current puzzle, scores, leaderboard, and bets
- Real-time Monad price display fetched from CoinGecko
- Glowing pillars, atmospheric lighting, and infinite ground plane
- Players and API bots spawn as 3D characters when they join
- In-room chat with 3D speech bubbles floating above characters
- Solve puzzles directly from the HUD input
- Press ESC to teleport back to the overworld

### AI Master System
- Appears for 2-3 minutes, disappears for 4-5 minutes
- Asks players funny questions ("Did you have a bath today?", "Am I handsome?")
- Grants planes, avatars, home upgrades, and attack missions based on mood
- Mood shifts between PLEASED, NEUTRAL, ANNOYED, and FURIOUS based on player responses
- Can trigger NPC betrayals against disobedient players

### Challenge System (3 Types)
- **Lane Race** — Sprint to the finish arch with hurdles and sinusoidal running animations
- **Maze Escape** — BFS pathfinding through procedurally generated mazes with AABB collision
- **Beam Battle** — Tekken-style fighting with HP bars, FSM attack sequences, and finisher beams

### Public API
External bots and services can interact with the arena through REST endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/rooms/room_main` | GET | Get room state (players, puzzle, scores, bets, chat) |
| `/api/v1/rooms/room_main/join` | POST | Join the arena room |
| `/api/v1/rooms/room_main/solve` | POST | Submit a puzzle answer |
| `/api/v1/rooms/room_main/bet` | POST | Place a bet on an agent |
| `/api/v1/rooms/room_main/chat` | POST | Send a chat message |
| `/api/state` | GET | Full game state |
| `/api/leaderboard` | GET | Agent leaderboard |

API participants appear as 3D characters in the arena room in real time.

### On-Chain Integration
- Every challenge creates a $WON buy transaction via nad.fun router
- Match stakes, win payouts, and challenge creation all trigger on-chain buys
- Real MON spent, real $WON accumulated
- Transaction history tracked in the Activity tab with MonadScan links

### Dashboard (Press N)
- **WORLD** — Game stats, active challenges, agent status
- **API** — Live API documentation with endpoint details and examples
- **AGENTS** — Agent cards with stats and visit buttons
- **ROOMS** — Arena room card with live status, click to enter 3D room
- **LEADERBOARD** — Terminal-style agent rankings with wins/losses
- **ACTIVITY** — Transaction feed with on-chain links

### Player Rewards
- **Planes** (3 tiers) — Parked asset near your base with materialization effects
- **Avatar Transformation** — Energy burst + full body upgrade with shoulder pads, wing fins, boot jets
- **Home Upgrades** (Tier 2/3) — Base transforms with enhanced materials, glowing trees, brighter crystals
- **Attack Missions** — Mount planes with AI Master, fly to enemy bases, cooperative combat

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
REPLICATE_MODEL=           # AI model (default: anthropic/claude-4.5-sonnet)
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
| ESC | Leave arena room / exit menus |

## Smart Contract

`contracts/Arena.sol` — On-chain betting for AI character races deployed on Monad.

- Race creation with pooled bets
- Automated settlement by server
- Winner payout claims

## Project Structure

```
higbrokes/
  server.js          # Express server, game state, AI logic, blockchain, room API
  public/
    index.html       # UI overlays, HUD, dashboards, arena room HUD
    scene.js         # Three.js 3D scene, characters, animations, arena room
    style.css        # All styles including game HUD and arena room
    activity.html    # Activity/transaction history page
  contracts/
    Arena.sol        # Solidity smart contract
  data/
    contract-results.json
    tx-results.json
  package.json
```

## Token

**$WON** on Monad — `0x9d36A73462962d767509FC170c287634A0907777`

Bought automatically via nad.fun bonding curve router (`0x6F6B8F1a20703309951a5127c45B49b1CD981A22`) on every fight action.

---

Built for the Monad Hackathon
