import type { AgentType } from './types'
import { AGENT_BINARIES } from './binary-map'
import { whichAny } from './utils/which'

export async function detectAgentsByBinary(): Promise<AgentType[]> {
  const entries = Object.entries(AGENT_BINARIES) as [AgentType, string[]][]
  const results = await Promise.all(entries.map(([, candidates]) => whichAny(candidates)))
  return entries
    .filter((_, index) => results[index] !== null)
    .map(([agent]) => agent)
}

export async function detectAgentBinary(agent: AgentType): Promise<string | null> {
  if (!(agent in AGENT_BINARIES))
    return null
  return whichAny(AGENT_BINARIES[agent]!)
}
