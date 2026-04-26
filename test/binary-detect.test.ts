import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { agents } from '../src/agents'
import { detectAgentBinary, detectAgentsByBinary } from '../src/binary-detect'

describe('detectAgentBinary', () => {
  it('resolves without throwing for a known agent', async () => {
    const result = await detectAgentBinary('claude-code')
    expect(result === null || (typeof result === 'string' && result.length > 0)).toBe(true)
  })

  it('returns null for universal agent (not in binary map)', async () => {
    const result = await detectAgentBinary('universal')
    expect(result).toBeNull()
  })
})

describe('detectAgentsByBinary', () => {
  it('returns an array of valid AgentType values', async () => {
    const result = await detectAgentsByBinary()
    expect(Array.isArray(result)).toBe(true)
    for (const entry of result) {
      expect(entry in agents).toBe(true)
    }
  })
})

describe('detectAgentsByBinary (mock PATH)', () => {
  let tmpDir: string
  let originalPath: string | undefined

  beforeEach(async () => {
    tmpDir = await mkdtemp(path.join(tmpdir(), 'which-test-'))
    await mkdir(tmpDir, { recursive: true })
    const stubFile = path.join(tmpDir, 'claude')
    await writeFile(stubFile, '#!/bin/sh\n')
    await chmod(stubFile, 0o755)
    originalPath = process.env.PATH
    process.env.PATH = tmpDir
  })

  afterEach(async () => {
    process.env.PATH = originalPath
    await rm(tmpDir, { recursive: true, force: true })
  })

  it.skipIf(process.platform === 'win32')('detects claude-code when stub binary is on PATH', async () => {
    // Reset to bypass which.ts's module-scoped cache, which earlier tests populated against the real PATH.
    vi.resetModules()
    const { detectAgentsByBinary: detect } = await import('../src/binary-detect')
    const result = await detect()
    expect(result).toContain('claude-code')
  })
})
