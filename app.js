const tasks = [
  {
    id: 'research',
    title: 'Buy API credits for market research',
    amount: 7.5,
    confidence: 94,
    reason: 'Highest confidence and within the user spending cap.',
  },
  {
    id: 'deploy',
    title: 'Sponsor gas for contract deployment',
    amount: 11.8,
    confidence: 87,
    reason: 'Useful, but consumes nearly the full hourly cap.',
  },
  {
    id: 'notify',
    title: 'Pay notification worker for 24h monitoring',
    amount: 4.2,
    confidence: 78,
    reason: 'Cheap, but less urgent than the active research task.',
  },
]

const state = {
  address: '',
  permission: 'idle',
  selectedTask: null,
  relayReceipt: null,
}

const walletLabel = document.querySelector('#walletLabel')
const walletDot = document.querySelector('#walletDot')
const connectWallet = document.querySelector('#connectWallet')
const grantPermission = document.querySelector('#grantPermission')
const permissionStatus = document.querySelector('#permissionStatus')
const runAgent = document.querySelector('#runAgent')
const executeRelay = document.querySelector('#executeRelay')
const taskList = document.querySelector('#taskList')
const agentDecision = document.querySelector('#agentDecision')
const agentReason = document.querySelector('#agentReason')
const relayRequest = document.querySelector('#relayRequest')
const relayStatus = document.querySelector('#relayStatus')
const relayResult = document.querySelector('#relayResult')
const canvas = document.querySelector('#agentCanvas')
const context = canvas.getContext('2d')

function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function renderTasks() {
  taskList.innerHTML = tasks.map(task => `
    <div class="task ${state.selectedTask?.id === task.id ? 'selected' : ''}">
      <header>
        <strong>${task.title}</strong>
        <span>$${task.amount.toFixed(2)}</span>
      </header>
      <p>${task.confidence}% confidence. ${task.reason}</p>
    </div>
  `).join('')
}

function renderWallet() {
  if (state.address) {
    walletLabel.textContent = shortAddress(state.address)
    walletDot.classList.add('connected')
    connectWallet.innerHTML = '<span aria-hidden="true">◈</span> Connected'
    grantPermission.disabled = false
    return
  }

  walletLabel.textContent = 'Not connected'
  walletDot.classList.remove('connected')
  grantPermission.disabled = true
}

function renderPermission() {
  if (state.permission === 'granted') {
    permissionStatus.textContent = 'Permission granted. The agent can spend up to $12 USDC for one approved task.'
    runAgent.disabled = false
    return
  }

  if (state.permission === 'fallback') {
    permissionStatus.textContent = 'Advanced permission was not available, so the demo continues with connected account consent.'
    runAgent.disabled = false
    return
  }

  if (state.permission === 'requesting') {
    permissionStatus.textContent = 'Requesting a scoped spending permission from MetaMask...'
    runAgent.disabled = true
    return
  }

  runAgent.disabled = true
}

function drawAgentGraph(stage = 'idle') {
  const width = canvas.width
  const height = canvas.height
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#0b1218'
  context.fillRect(0, 0, width, height)

  const nodes = [
    { x: 82, y: 130, label: 'Intent' },
    { x: 220, y: 70, label: 'Policy' },
    { x: 220, y: 190, label: 'Budget' },
    { x: 390, y: 130, label: 'Agent' },
    { x: 540, y: 130, label: 'Relayer' },
  ]

  context.lineWidth = 3
  context.strokeStyle = stage === 'idle' ? '#2c3a46' : '#64b5ff'
  const links = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]]
  links.forEach(([a, b]) => {
    context.beginPath()
    context.moveTo(nodes[a].x, nodes[a].y)
    context.lineTo(nodes[b].x, nodes[b].y)
    context.stroke()
  })

  nodes.forEach((node, index) => {
    const active = stage !== 'idle' && index <= (stage === 'relay' ? 4 : 3)
    context.beginPath()
    context.arc(node.x, node.y, 36, 0, Math.PI * 2)
    context.fillStyle = active ? '#5ee29b' : '#17212c'
    context.fill()
    context.strokeStyle = active ? '#bfffd8' : '#2c3a46'
    context.stroke()
    context.fillStyle = active ? '#06110c' : '#edf3f7'
    context.font = '700 13px system-ui'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(node.label, node.x, node.y)
  })
}

async function handleConnect() {
  if (!window.ethereum) {
    permissionStatus.textContent = 'MetaMask is not installed. You can still record the local demo flow.'
    state.address = '0xDemo000000000000000000000000000000Pilot'
    renderWallet()
    return
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    state.address = accounts[0] || ''
    permissionStatus.textContent = 'Wallet connected. Request a capped permission to continue.'
    renderWallet()
  } catch (error) {
    permissionStatus.textContent = error.message || 'Wallet connection rejected.'
  }
}

async function handlePermission() {
  state.permission = 'requesting'
  renderPermission()

  if (!window.ethereum || state.address.startsWith('0xDemo')) {
    setTimeout(() => {
      state.permission = 'fallback'
      renderPermission()
    }, 500)
    return
  }

  try {
    await window.ethereum.request({
      method: 'wallet_grantPermissions',
      params: [{
        signer: { type: 'account', data: { address: state.address } },
        permissions: [{
          chainId: '0x1',
          expiry: Math.floor(Date.now() / 1000) + 3600,
          permission: {
            type: 'erc20-token-transfer',
            data: {
              token: 'USDC',
              limit: '12',
              recipientPolicy: 'agent-approved-task',
            },
          },
        }],
      }],
    })
    state.permission = 'granted'
  } catch (error) {
    state.permission = 'fallback'
  }

  renderPermission()
}

function handleRunAgent() {
  const eligible = tasks
    .filter(task => task.amount <= 12)
    .sort((a, b) => b.confidence - a.confidence)

  state.selectedTask = eligible[0]
  agentDecision.textContent = `Selected: ${state.selectedTask.title}`
  agentReason.textContent = `${state.selectedTask.reason} Prepared a $${state.selectedTask.amount.toFixed(2)} USDC transfer under the granted cap.`
  relayRequest.textContent = `$${state.selectedTask.amount.toFixed(2)} USDC payment`
  relayStatus.textContent = 'Prepared'
  relayResult.textContent = 'Awaiting relayer execution'
  executeRelay.disabled = false
  renderTasks()
  drawAgentGraph('agent')
}

function handleRelay() {
  executeRelay.disabled = true
  relayStatus.textContent = 'Submitting JSON-RPC request'

  setTimeout(() => {
    const digest = Math.random().toString(16).slice(2, 10)
    state.relayReceipt = `0xpilot${digest}`
    relayStatus.textContent = 'Sponsored by relayer'
    relayResult.textContent = state.relayReceipt
    drawAgentGraph('relay')
  }, 850)
}

connectWallet.addEventListener('click', handleConnect)
grantPermission.addEventListener('click', handlePermission)
runAgent.addEventListener('click', handleRunAgent)
executeRelay.addEventListener('click', handleRelay)

renderTasks()
renderWallet()
renderPermission()
drawAgentGraph()
