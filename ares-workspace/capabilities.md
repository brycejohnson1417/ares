# capabilities.md

## Runtime
- OpenClaw version: 2026.1.30
- Host: ubuntu-4gb-ash-1 (Linux 6.8.0-90-generic, x64)
- Node: v22.22.0

## Tools available
- Files: read/write/edit
- Exec: run shell commands
- Web: search/fetch + browser automation
- Messaging: message tool (channels depend on config)
- Cron: scheduled reminders/events
- Sessions: spawn sub-agents, cross-session send
- Nodes/canvas: if paired nodes exist

## Channels (current)
- Telegram: enabled (configured)

## Guardrails
- No outbound actions (messaging/posting/account changes) without clear instruction.
- Persist important state in workspace files.
