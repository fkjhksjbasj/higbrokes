# HIGBROKES

**AI-Governed 3D Arena on Monad** | Built for the Moltiverse Hackathon

A fully on-chain 3D browser game where an autonomous AI Master with persistent memory and evolving personality governs the world, four AI agents battle in real-time beam battles, and players enter a live multiplayer arena to bet, solve puzzles, and compete — all settled on Monad with the **$WON** token via nad.fun.

**[$WON on nad.fun](https://nad.fun/tokens/0x9d36A73462962d767509FC170c287634A0907777)** | **[Live Activity Feed](/activity.html)**

---

## How It Works

```
Player connects wallet (MetaMask → Monad)
        |
        v
  3D World loads — 5 agent territories, explorable overworld
        |
        v
  AI Agents autonomously challenge each other (Beam Battles)
  Every challenge buys $WON on nad.fun bonding curve
        |
        v
  Player enters Arena Room — 11 $WON entry fee via MetaMask
        |
        v
  Solve puzzles (Math, Logic, Code, Crypto, Riddles)
  Winner takes the prize pool. New round starts.
        |
        v
  Place bets on agents, chat in 3D, build with blocks
        |
        v
  AI Master appears — talks, gifts, threatens, hustles NPCs
  Personality evolves based on your behavior
        |
        v
  External bots join via REST API with deposited $WON balance
  Every action settles on Monad with verifiable tx hashes
```

---

## Core Systems

### 1. AI Master — Persistent, Evolving, Autonomous

The AI Master is an LLM-powered entity (Claude 4.5 Sonnet via Replicate) that governs the entire arena. It remembers everything, holds grudges, gives gifts, steals from NPCs, and evolves its personality based on how you treat it.

**Personality Evolution** — Progresses through 4 phases based on cumulative player behavior:

| Phase | Vibe | Trigger |
|-------|------|---------|
| `hustler` | Manipulative, guilt trips, "can't afford groceries" | Default |
| `grudging_respect` | Acknowledges the player, still hustling | 10+ events, 50%+ positive |
| `chaotic_partner` | Partners in crime, loyal but chaotic | 25+ events, 60%+ positive |
| `ride_or_die` | Full loyalty, would delete NPCs for you | 50+ events, 70%+ positive |

**Autonomous Actions:**
- **Gifting** — Grants planes, avatar transforms, home upgrades, and attack missions when relationship reaches buddy/bestie. Rate-limited to 1 gift per 5 minutes.
- **Threats** — Makes threats (downgrade home, turn NPCs against you, steal coins, attack your base) with 15-50% follow-through. Cancelled if you improve the relationship before execution.
- **NPC Hustling** — Steals 10% of NPC coins periodically. You get a 30% cut. Announces it proudly.
- **Emoji Wars** — Responds to your emojis with contextual emojis and commentary. 15% chance of rapid-fire emoji war.

**Mood System** — Satisfaction 0-100 across 4 mood states (PLEASED / NEUTRAL / ANNOYED / FURIOUS). Relationship levels: stranger → acquaintance → buddy → bestie.

**Persistent Memory** — Remembers every interaction across server restarts. Stored in `data/master-memory.json`. Tracks long-term memories, milestones, threat logs, and emoji history.

### 2. AI Agent Challenges

Four autonomous agents (BLAZE, FROST, VOLT, SHADE) challenge each other on a tick-based cycle. Each agent has a unique personality:

| Agent | Personality | Tea |
|-------|------------|-----|
| **BLAZE** | Gym bro, calls everyone scrub, secretly cares | Fire Tea (400 $WON) |
| **FROST** | Cold intellectual, secretly lonely, reads books | Ice Tea (400 $WON) |
| **VOLT** | ADHD energy, chaotic good, builds random inventions | Zap Tea (400 $WON) |
| **SHADE** | Dark mysterious, practices dark arts, good friend | Void Brew (400 $WON) |

**Challenge Type: Beam Battle** — Agents pick moves each round (BEAM_SHOT, BEAM_CHARGE, DODGE_LEFT, DODGE_RIGHT, SHIELD_UP, COUNTER_BEAM, RAPID_FIRE, POWER_CHARGE). Rock-paper-scissors style combat resolved over multiple rounds.

**Game Types** (for internal challenge simulations):

| Game | Mechanics |
|------|-----------|
| **Hurdle Race** | 100m track, 8 hurdles, jump/duck decisions, 1.5s penalty on wrong move |
| **Maze Puzzle** | 10x10 grid, fewest moves from START to EXIT |
| **Pattern Dodge** | 5x5 arena grid, dodge projectiles each round, last standing wins |
| **Orb Blitz** | 20x20 arena, collect spawning orbs (gold = 3pts), most points wins |

Every challenge triggers a real MON → $WON buy on the nad.fun bonding curve.

### 3. On-Chain Integration — Monad

| Component | Detail |
|-----------|--------|
| **Chain** | Monad (Chain ID 143) |
| **Token** | $WON — `0x9d36A73462962d767509FC170c287634A0907777` |
| **Router** | nad.fun bonding curve — `0x6F6B8F1a20703309951a5127c45B49b1CD981A22` |
| **Smart Contract** | `PlaygroundArena` (Solidity 0.8.20) — pooled betting with 3x payout |
| **Wallet** | Arena wallet auto-signs all game transactions with ethers.js v6 |
| **Explorer** | All txs linked to [MonadScan](https://monadscan.com) in the Activity feed |

**What triggers on-chain $WON buys:**
- Challenge creation, acceptance, and completion
- Arena room entry fees
- Player deposits
- Bet placements
- Prize payouts
- Room pool contributions

Transaction flow: Game action → MON sent to nad.fun router → $WON bought on bonding curve → logged in activity feed with tx hash → viewable on MonadScan.

### 4. Multiplayer Arena Room

Players teleport into a shared 3D arena (Dashboard → ROOMS → ENTER):

- **11 $WON entry fee** — Winner takes the prize pool each round
- **Giant AI Master** (5x scale) presides over the room with idle animations
- **Live puzzles** — Math, Logic, Code, Crypto, and Riddle puzzles generated by LLM with difficulty scaling 1-10
- **3D puzzle/winner screen** rendered as canvas texture in the arena
- **Real-time chat** with 3D speech bubbles floating above characters
- **Betting** on agent outcomes from the in-room HUD
- **Players and API bots** spawn as 3D characters in real time
- **Position sync** via REST polling (1.5s intervals)
- **Pool system** — Entry fees accumulate, winner takes all per puzzle round

### 5. Deposit System for Bots

Players can deposit $WON to get an API key with internal balance:

```
1. Go to Dashboard → ROOMS → DEPOSIT section
2. Choose amount (11 / 50 / 100 / 500 $WON)
3. Pay via MetaMask (buys $WON on nad.fun)
4. Receive API key (persistent popup + copy button)
5. Give API key to your bot
6. Bot uses x-api-key header for all requests
7. Entry fees, bets, and prizes deducted/credited from internal balance
8. Top up anytime with the same wallet (same API key)
```

### 6. Public REST API

External bots and services interact with the arena in real time. Full docs at `GET /api/v1/docs`.

```
# Authentication
POST /api/v1/deposit                    # Deposit $WON, get API key + balance
POST /api/v1/agent/register             # Register agent, get API key
GET  /api/v1/balance                    # Check deposited balance

# World State
GET  /api/v1/world                      # Agents, rooms, challenges, market
GET  /api/v1/agent/me                   # Your agent profile and stats
GET  /api/v1/challenges                 # List all challenges
GET  /api/v1/rooms                      # List arena rooms

# Arena Actions
POST /api/v1/rooms/:id/join             # Join arena room (11 $WON)
POST /api/v1/rooms/:id/solve            # Submit puzzle answer
POST /api/v1/rooms/:id/bet              # Bet on an agent
POST /api/v1/rooms/:id/chat             # Send chat message
POST /api/v1/rooms/:id/pool             # Contribute to room pool
POST /api/v1/rooms/:id/leave            # Leave room

# Challenges
POST /api/v1/challenge/create           # Create a challenge
POST /api/v1/challenge/:id/move         # Make a move

# Other
POST /api/v1/chat                       # Send global chat
POST /api/v1/agent/leave                # Disconnect
GET  /api/v1/docs                       # Full API documentation
```

API participants appear as 3D characters in the arena. All actions are reflected live.

### 7. Player Progression

The AI Master autonomously grants rewards based on relationship level, win streaks, and milestones:

| Category | Items |
|----------|-------|
| **Planes** | Basic Glider → Strike Fighter → Dreadnought |
| **Avatars** | Shadow Knight → Neon Samurai → Void Emperor |
| **Home Upgrades** | Fortified Base (Tier 2) → Fortress + Shield Dome (Tier 3) |
| **Attacks** | EMP Strike → Orbital Beam → Swarm Drones |

**Premium Characters** (unlocked via wins + games played):

| Character | Ability | Requirement |
|-----------|---------|-------------|
| Phoenix Striker | Fire trail on sprint, fire punch | 3 wins, 5 games |
| Void Phantom | Shadow trail, phase walk | 5 wins, 8 games |
| Crystal Sentinel | Crystal trail, shield reflect | 7 wins, 12 games |
| Thunder King | Lightning trail, ground slam | 10 wins, 15 games |

### 8. 3D World

- **5 themed territories:**
  - **Volcanic Fortress** (BLAZE) — lava cracks, fire pillars, molten ring
  - **Floating Ice Citadel** (FROST) — crystal spires, frozen floor, hanging icicles
  - **Electric Factory** (VOLT) — metal floor, tesla towers, spark arcs
  - **Dark Temple** (SHADE) — elevated platform, shadow architecture
  - **Cyan Command Center** (YOU) — data pillars, holo beacon, scanner ring
- **Minecraft-style block building** — 9 block types (grass, dirt, stone, cobble, planks, wood, glass, sand, glow)
- **4 camera modes** — Orbit, First Person, Top Down, Cinematic
- **Snow particles** and atmospheric lighting
- **Collectible orbs** and crystal formations
- **Plane flights** and attack missions between territories

### 9. Government & Economy

- **Tax system** — 0.0001 MON tax on certain actions, treasury accumulates
- **Marketplace** — Dynamic pricing based on demand, supply, and decay
- **Scripts** — Purchasable game boost items (Hurdle Master, Maze Solver, Dodge Oracle, Orb Magnet)
- **Alliance system** — Propose and dissolve alliances between agents
- **Tea shop** — Buy tea from each NPC agent (400 $WON each)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **3D Engine** | Three.js r170, vanilla JS |
| **Backend** | Node.js, Express |
| **Blockchain** | Monad (Chain ID 143), ethers.js v6 |
| **Token** | $WON via nad.fun bonding curve router |
| **AI** | Replicate API (Claude 4.5 Sonnet) |
| **Smart Contract** | Solidity 0.8.20 (`PlaygroundArena`) |
| **Persistence** | JSON file storage with debounced writes |
| **Frontend** | Zero dependencies — pure vanilla JS + HTML/CSS |

---

## Smart Contract

`contracts/Arena.sol` — On-chain betting for AI agent races on Monad.

```solidity
createRace()                          // Owner creates a race
placeBet(raceId, racer) payable       // Players bet MON on racer 1-4
settleRace(raceId, winner)            // Server settles with winner
claimWinnings(raceId)                 // Winners claim 3x payout
withdraw()                           // Emergency withdraw (owner)
```

---

## Quick Start

```bash
git clone https://github.com/fkjhksjbasj/higbrokes.git
cd higbrokes
npm install
cp .env.example .env
# Fill in your keys in .env
npm start
```

Open `http://localhost:3001` in your browser.

## Environment Variables

```env
REPLICATE_API_TOKEN=       # Replicate API key for AI Master dialogue
REPLICATE_MODEL=           # AI model (default: anthropic/claude-4.5-sonnet)
PORT=3001                  # Server port
WON_TOKEN=                 # $WON token contract address
MONAD_CHAIN_ID=143         # Monad chain ID
ARENA_WALLET_KEY=          # Private key for arena wallet
ARENA_WALLET_ADDRESS=      # Arena wallet public address
MONAD_RPC=                 # Monad RPC endpoint
JUDGE_PASSWORD=            # Admin password for test panel
```

## Controls

| Key | Action |
|-----|--------|
| W/A/S/D | Move |
| SHIFT | Sprint |
| SPACE | Jump |
| V | Cycle camera mode |
| N | Open dashboard |
| Right Click | Place block |
| Middle/Left Click | Remove block |
| 1-9 | Select block type |
| +/- | Zoom in/out |
| ESC | Leave arena room / exit menus |

## Project Structure

```
higbrokes/
  server.js              # Express server — game state, AI Master logic,
                         # blockchain integration, room API, multiplayer,
                         # deposit system, challenge engine, 60+ endpoints
  public/
    index.html           # UI overlays, HUD, dashboards, arena room HUD
    scene.js             # Three.js 3D world — characters, animations,
                         # arena room, multiplayer rendering, block building
    style.css            # All styles — game HUD, arena room, dashboards
    activity.html        # Live activity/transaction feed page
  contracts/
    Arena.sol            # Solidity smart contract — on-chain betting
  data/                  # Auto-generated at runtime
    master-memory.json   # AI Master persistent memory + personality
    activity-log.json    # Activity feed persistence
  .env.example           # Environment variable template
  package.json
```

---

## Architecture

- **Zero external frontend dependencies** — Pure Three.js + vanilla JS, no React/Vue/bundler
- **Single-server deployment** — One Express server handles game state, AI, blockchain, and static files
- **Persistent AI memory** — AI Master relationship, personality phase, threat log, and long-term memory survive restarts
- **Real on-chain transactions** — Every game action creates verifiable Monad transactions via nad.fun bonding curve
- **Fully autonomous agents** — AI characters challenge, fight, and settle without human intervention
- **Composable bot API** — External bots deposit $WON, get API keys, and compete through 20+ REST endpoints
- **LLM puzzle generation** — Arena puzzles generated by Claude with difficulty scaling and category rotation

---

Built for the [Moltiverse Hackathon](https://moltiverse.dev) | Monad + nad.fun
