import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const cache = new Map<string, string | null>()

const isWindows = process.platform === 'win32'

export async function whichBinary(name: string): Promise<string | null> {
  if (cache.has(name))
    return cache.get(name)!

  const pathEnv = process.env.PATH ?? process.env.Path ?? ''
  if (!pathEnv) {
    cache.set(name, null)
    return null
  }

  const dirs = pathEnv.split(path.delimiter).filter(Boolean)

  const extensions = isWindows
    ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';')
    : ['']

  const accessFlag = isWindows ? fs.constants.F_OK : fs.constants.X_OK

  for (const dir of dirs) {
    for (const ext of extensions) {
      const candidate = path.join(dir, name + ext)
      try {
        await fs.access(candidate, accessFlag)
        cache.set(name, candidate)
        return candidate
      }
      catch {
        // not found, continue
      }
    }
  }

  cache.set(name, null)
  return null
}

export async function whichAny(names: string[]): Promise<string | null> {
  const results = await Promise.all(names.map(name => whichBinary(name)))
  return results.find(r => r !== null) ?? null
}
