# HackQuest Submission Checklist

Hackathon: MetaMask Smart Accounts Kit x 1Shot API x Venice AI Dev Cook Off

Deadline: June 15, 2026 at 23:59 UTC

## Required Fit

- The project should use MetaMask Smart Accounts or Advanced Permissions.
- Advanced Permissions should be visible in the main app flow.
- The demo video should show the MetaMask integration working in the application.

## Permission Pilot Mapping

- Main flow starts with `Connect MetaMask`.
- Permission step attempts `wallet_grantPermissions`.
- If the wallet does not support the experimental permission method, the demo continues with connected-account fallback so the judging video still works.
- Agent step chooses a budget-compliant action.
- Relayer step produces a 1Shot-style execution receipt.

## Paste Into HackQuest

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

The main user flow is: connect MetaMask, request a capped permission, run the agent decision, and execute the selected action through a relayer-style receipt flow. This directly explores permission sharing and agentic UX for wallet-connected applications.
```

Category tracks:

```text
AI, Infra
```

Recommended prize alignment:

```text
Best Agent
Best Use of 1Shot Permissionless Relayer
Best use of Venice AI
Best x402 + ERC-7710
```

## Must Add Before Final Submit

- Public repository URL.
- Public demo URL or hosted static page URL.
- Demo video URL showing MetaMask connection and permission flow.

## Video Checklist

1. Show the Permission Pilot landing screen.
2. Click `Connect MetaMask`.
3. Show the connected wallet state.
4. Click `Grant Spending Permission`.
5. Click `Run Agent Decision`.
6. Show the selected task and planning graph.
7. Click `Execute with Relayer`.
8. Show the relayer receipt.
