import { invalidEffectSyntax } from './errors.ts'
import type { EffectOptions } from './registry.ts'

export interface ParsedEntry {
  readonly name: string
  readonly options: EffectOptions
}

// Args may hold quoted text containing parens, so the body alternates quoted
// runs with anything that is not a paren rather than matching to the first ')'.
const ENTRY = /([A-Za-z][A-Za-z0-9_-]*)\s*(?:\(((?:"[^"]*"|'[^']*'|[^()])*)\))?/g
const SEPARATOR = /^[\s,+|]*$/
const ARGUMENT = /(?:"[^"]*"|'[^']*'|[^,])+/g
const ASSIGNMENT = /^\s*([A-Za-z_][A-Za-z0-9_.-]*)\s*(?:[:=]([\s\S]*))?$/
const NUMBER = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i
const QUOTED = /^(['"])([\s\S]*)\1$/

const parseValue = (raw: string): unknown => {
  const text = raw.trim()
  const quoted = text.match(QUOTED)
  if (quoted) return quoted[2] ?? ''
  const lower = text.toLowerCase()
  if (lower === 'true') return true
  if (lower === 'false') return false
  if (lower === 'null' || lower === 'none' || lower === '') return null
  return NUMBER.test(text) ? Number(text) : text
}

const isPlainObject = (value: unknown): value is EffectOptions =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const mergeDeep = (base: EffectOptions, next: EffectOptions): EffectOptions =>
  Object.entries(next).reduce<EffectOptions>((merged, [key, value]) => {
    const existing = merged[key]
    return {
      ...merged,
      [key]: isPlainObject(existing) && isPlainObject(value) ? mergeDeep(existing, value) : value,
    }
  }, base)

const nest = (path: readonly string[], value: unknown): EffectOptions =>
  path.length <= 1 ? { [path[0] ?? '']: value } : { [path[0] ?? '']: nest(path.slice(1), value) }

const parseArgument = (source: string, entry: string): EffectOptions => {
  const match = source.match(ASSIGNMENT)
  if (!match) throw invalidEffectSyntax(`could not read "${source.trim()}" in ${entry}`)
  const [, key = '', raw] = match
  return nest(key.split('.'), raw === undefined ? true : parseValue(raw))
}

const parseOptions = (body: string | undefined, entry: string): EffectOptions =>
  body === undefined || body.trim() === ''
    ? {}
    : (body.match(ARGUMENT) ?? []).reduce<EffectOptions>(
        (options, argument) => mergeDeep(options, parseArgument(argument, entry)),
        {},
      )

const gapBefore = (source: string, matches: readonly RegExpExecArray[], index: number): string => {
  const previous = matches[index - 1]
  const start = previous === undefined ? 0 : previous.index + previous[0].length
  return source.slice(start, matches[index]?.index)
}

const rejectStrayText = (source: string, matches: readonly RegExpExecArray[]): void => {
  const last = matches[matches.length - 1]
  const stray = [
    ...matches.map((_, index) => gapBefore(source, matches, index)),
    last === undefined ? source : source.slice(last.index + last[0].length),
  ].find((gap) => !SEPARATOR.test(gap))
  if (stray !== undefined) throw invalidEffectSyntax(`unexpected "${stray.trim()}"`)
}

export const parseEffectString = (source: string): readonly ParsedEntry[] => {
  const matches = [...source.matchAll(ENTRY)] as RegExpExecArray[]
  rejectStrayText(source, matches)
  return matches.map((match) => ({
    name: match[1] ?? '',
    options: parseOptions(match[2], match[0]),
  }))
}
