# Permission Pilot

Permission Pilot is a lightweight MetaMask-first demo for the **MetaMask Smart Accounts Kit x 1Shot API x Venice AI Dev Cook Off**.

It shows a user granting a capped spending permission to an autonomous assistant. The assistant selects one approved task, prepares a transaction under the user-defined cap, and executes through a 1Shot-style relayer receipt flow.

## Why it fits the hackathon

- **MetaMask Smart Accounts / Advanced Permissions:** the app connects to MetaMask and attempts `wallet_grantPermissions` for a capped spending capability.
- **Agentic experience:** the assistant evaluates task candidates and chooses the highest-confidence option within the user's spending policy.
- **1Shot-style relayer:** the final step simulates a gas-sponsored JSON-RPC execution receipt.
- **Venice AI angle:** the agent panel is designed as a private AI decision layer; the current demo is deterministic so it can be recorded without API keys.

## Run locally

No install step is required.

Open `index.html` directly in a browser, or serve this folder:

```bash
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

## Demo script

1. Open Permission Pilot.
2. Click **Connect MetaMask**.
3. Click **Grant Spending Permission**.
4. Click **Run Agent Decision**.
5. Show the selected task and the planning graph.
6. Click **Execute with Relayer**.
7. Show the relayer receipt.

## HackQuest fields

Project name:

```text
Permission Pilot
```

Tagline:

```text
Give an AI agent a capped payment permission instead of your whole wallet.
```

Description:

```text
Permission Pilot is a MetaMask-powered autonomous payment assistant. A user connects MetaMask, grants a time-boxed spending capability, and lets a private agent choose one approved task within the user's budget. The app demonstrates an Advanced Permissions-ready wallet flow, deterministic agent reasoning for a reliable demo, and a 1Shot-style relayed execution receipt.
```

Suggested tracks:

```text
AI, Infra
```

Video outline:

```text
0:00 Permission Pilot problem: agents need bounded wallet access.
0:15 Connect MetaMask.
0:30 Request a capped spending permission.
0:50 Run the agent decision.
1:15 Execute through the relayer flow.
1:35 Show the receipt and explain how this maps to MetaMask Smart Accounts, Venice-style private reasoning, and 1Shot-style execution.
```
