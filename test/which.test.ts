import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { whichAny, whichBinary } from '../src/utils/which'

describe('whichBinary', () => {
  it('finds a known-present binary', async () => {
    const result = await whichBinary('node')

    expect(result).not.toBeNull()
    expect(typeof result).toBe('string')
    expect(path.isAbsolute(result!)).toBe(true)
    expect(path.basename(result!, path.extname(result!))).toBe('node')
  })

  it('returns null for a definitely-missing binary', async () => {
    const result = await whichBinary(`definitely-not-a-real-binary-${Date.now()}`)
    expect(result).toBeNull()
  })

  it('returns identical string on repeated calls (cache idempotency)', async () => {
    const first = await whichBinary('node')
    const second = await whichBinary('node')
    expect(first).toBe(second)
  })
})

describe('whichAny', () => {
  it('returns the first match when one candidate exists', async () => {
    const missing = `definitely-missing-${Date.now()}`
    const result = await whichAny([missing, 'node'])
    const nodeResult = await whichBinary('node')
    expect(result).toBe(nodeResult)
  })

  it('returns null when all candidates are missing', async () => {
    const result = await whichAny([
      `fake-binary-a-${Date.now()}`,
      `fake-binary-b-${Date.now()}`,
    ])
    expect(result).toBeNull()
  })
})
