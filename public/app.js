// GENESIS Frontend — Dashboard Logic

const EXPLORER = 'https://explorer.monad.xyz';
const POLL_INTERVAL = 10000; // 10 seconds

let chart = null;
let userWallet = null;

// ===== DATA FETCHING =====
async function fetchStatus() {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function fetchEconomy() {
  try {
    const res = await fetch('/api/economy');
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function fetchFeed() {
  try {
    const res = await fetch('/api/feed');
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// ===== UPDATE UI =====
function updateMetrics(economy) {
  if (!economy || !economy.aiWorld) return;

  const ai = economy.aiWorld;

  document.getElementById('ai-gdp').textContent =
    `${ai.gdpGrowth > 0 ? '+' : ''}${ai.gdpGrowth}%`;
  document.getElementById('ai-gini').textContent = ai.giniCoefficient.toFixed(3);
  document.getElementById('ai-unemployment').textContent = `${ai.unemployment}%`;
  document.getElementById('ai-poverty').textContent = `${ai.povertyRate}%`;
  document.getElementById('ai-corruption').textContent = '0%';
  document.getElementById('ai-trades').textContent = `${ai.tradeVolume} txns`;
  document.getElementById('ai-circulation').textContent = `${ai.totalCirculation} MON`;

  // Update question
  if (economy.provocativeQuestion) {
    document.getElementById('question-text').textContent = economy.provocativeQuestion;
  }
}

function updateAgents(status) {
  if (!status || !status.agents) return;

  for (const agent of status.agents) {
    const balEl = document.getElementById(`bal-${agent.role}`);
    const stmtEl = document.getElementById(`stmt-${agent.role}`);
    if (balEl) {
      const bal = parseFloat(agent.balance).toFixed(4);
      balEl.textContent = `${bal} MON`;
    }
    if (stmtEl && agent.lastStatement) {
      stmtEl.textContent = agent.lastStatement;
    }
  }

  // Update cycle badge
  const badge = document.getElementById('cycle-badge');
  if (badge) {
    const uptime = Math.floor((Date.now() - status.startedAt) / 1000 / 60);
    badge.textContent = `Cycle #${status.cycleNumber} · Running ${uptime}m`;
  }
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function updateFeed(feed) {
  if (!feed || feed.length === 0) return;

  const container = document.getElementById('feed-container');
  container.innerHTML = '';

  for (const entry of feed.slice(0, 50)) {
    const div = document.createElement('div');
    div.className = `feed-entry ${entry.agent} fade-in`;

    let txHtml = '';
    if (entry.txHash) {
      txHtml = ` <a class="feed-tx" href="${EXPLORER}/tx/${entry.txHash}" target="_blank">[tx]</a>`;
    }

    let comparisonHtml = '';
    if (entry.comparison) {
      comparisonHtml = `<div class="feed-comparison">${entry.comparison}</div>`;
    }

    div.innerHTML = `
      <div class="feed-header">
        <span class="feed-agent">${entry.agent}</span>
        <span class="feed-time">${timeAgo(entry.timestamp)}</span>
      </div>
      <div class="feed-action">${entry.action}${txHtml}</div>
      <div class="feed-detail">${entry.detail}</div>
      ${comparisonHtml}
    `;

    container.appendChild(div);
  }
}

// ===== CHART =====
function initChart() {
  const ctx = document.getElementById('economy-chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'AI World GDP',
          data: [],
          borderColor: '#00ff88',
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'AI World Gini (x10)',
          data: [],
          borderColor: '#4488ff',
          backgroundColor: 'rgba(68, 136, 255, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Real World Gini (x10)',
          data: [],
          borderColor: '#ff4455',
          borderDash: [5, 5],
          borderWidth: 1,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#6a6a8a', font: { family: 'Space Grotesk' } },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: { color: '#6a6a8a', font: { family: 'JetBrains Mono', size: 10 } },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: { color: '#6a6a8a', font: { family: 'JetBrains Mono', size: 10 } },
        },
      },
    },
  });
}

function updateChart(status) {
  if (!chart || !status || !status.metricsHistory) return;

  const history = status.metricsHistory;
  chart.data.labels = history.map(m => `#${m.cycleNumber}`);
  chart.data.datasets[0].data = history.map(m => m.gdp);
  chart.data.datasets[1].data = history.map(m => m.giniCoefficient * 10);
  chart.data.datasets[2].data = history.map(() => 0.39 * 10); // Real world Gini constant
  chart.update('none');
}

// ===== WALLET CONNECT =====
async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask to connect your wallet.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userWallet = accounts[0];

    // Switch to Monad network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x8f' }], // 143 in hex
      });
    } catch (switchErr) {
      // Add network if not found
      if (switchErr.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x8f',
            chainName: 'Monad Mainnet',
            rpcUrls: ['https://monad-mainnet.drpc.org'],
            nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
            blockExplorerUrls: ['https://explorer.monad.xyz'],
          }],
        });
      }
    }

    // Get balance
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(userWallet);
    const balFormatted = parseFloat(ethers.formatEther(balance)).toFixed(4);

    document.getElementById('wallet-btn').textContent = `${userWallet.slice(0, 6)}...${userWallet.slice(-4)}`;
    document.getElementById('wallet-info').textContent = `Balance: ${balFormatted} MON · Connected to Monad`;

    // Show donate buttons on agent cards
    showDonateButtons();
  } catch (err) {
    console.error('Wallet connect failed:', err);
    document.getElementById('wallet-info').textContent = 'Connection failed: ' + err.message;
  }
}

async function showDonateButtons() {
  try {
    const res = await fetch('/api/addresses');
    const addresses = await res.json();

    for (const [role, address] of Object.entries(addresses)) {
      const card = document.querySelector(`.agent-card[data-role="${role}"]`);
      if (card && !card.querySelector('.donate-btn')) {
        const btn = document.createElement('button');
        btn.className = 'donate-btn';
        btn.textContent = 'Donate 0.01 MON';
        btn.style.cssText = 'margin-top:8px;padding:4px 8px;background:transparent;border:1px solid var(--green);color:var(--green);border-radius:6px;font-size:0.65rem;cursor:pointer;font-family:Space Grotesk;';
        btn.onclick = () => donateTo(address, role);
        card.appendChild(btn);
      }
    }
  } catch (err) {
    console.error('Failed to load addresses:', err);
  }
}

async function donateTo(address, role) {
  if (!userWallet) return;
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to: address,
      value: ethers.parseEther('0.01'),
    });
    alert(`Donated 0.01 MON to ${role}! TX: ${tx.hash.slice(0, 10)}...`);
  } catch (err) {
    alert('Donation failed: ' + err.message);
  }
}

// ===== MAIN LOOP =====
async function refresh() {
  const [status, economy, feed] = await Promise.all([
    fetchStatus(),
    fetchEconomy(),
    fetchFeed(),
  ]);

  updateMetrics(economy);
  updateAgents(status);
  updateFeed(feed);
  updateChart(status);
}

// Initialize
initChart();
refresh();
setInterval(refresh, POLL_INTERVAL);
