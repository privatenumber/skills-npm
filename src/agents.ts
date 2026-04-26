import type { AgentType } from './types'

import { agents, detectInstalledAgents } from '../vendor/skills/src/agents'
import { detectAgentsByBinary } from './binary-detect'

export { agents, detectInstalledAgents } from '../vendor/skills/src/agents'
export { detectAgentBinary, detectAgentsByBinary } from './binary-detect'

export async function getDetectedAgents(): Promise<AgentType[]> {
  const [dirDetected, binaryDetected] = await Promise.all([
    detectInstalledAgents(),
    detectAgentsByBinary(),
  ])

  const union = new Set<AgentType>([...dirDetected, ...binaryDetected])

  return (Object.keys(agents) as AgentType[]).filter(agent => union.has(agent))
}

export function getAllAgentTypes(): AgentType[] {
  return Object.keys(agents) as AgentType[]
}
