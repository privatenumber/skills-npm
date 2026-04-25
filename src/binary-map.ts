// Maps agent types to their known CLI binary names for PATH-based detection

import type { AgentType } from './types'

export const AGENT_BINARIES: Partial<Record<AgentType, string[]>> = {
  'amp': ['amp'],
  'claude-code': ['claude'],
  'codex': ['codex'],
  'crush': ['crush'],
  'cursor': ['cursor', 'cursor-agent'],
  'droid': ['droid'],
  'gemini-cli': ['gemini'],
  'github-copilot': ['copilot'],
  'goose': ['goose'],
  'iflow-cli': ['iflow'],
  'kimi-cli': ['kimi'],
  'kiro-cli': ['kiro'],
  'mistral-vibe': ['vibe'],
  'openclaw': ['openclaw', 'clawdbot', 'moltbot'],
  'opencode': ['opencode'],
  'pochi': ['pochi'],
  'qwen-code': ['qwen'],
  'warp': ['warp'],
  'windsurf': ['windsurf'],
}
