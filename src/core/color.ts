import { tryParseRgb } from 'grfti'
import { clamp } from './numbers.ts'

export interface Rgb {
  readonly red: number
  readonly green: number
  readonly blue: number
}

export const BLACK: Rgb = { red: 0, green: 0, blue: 0 }

export const WHITE: Rgb = { red: 1, green: 1, blue: 1 }

// vctrfx has always accepted bare hex without the leading '#'.
const BARE_HEX = /^[0-9a-f]{3,8}$/i

export const parseColor = (value: string, fallback: Rgb = BLACK): Rgb => {
  const trimmed = value.trim()
  const parsed = tryParseRgb(BARE_HEX.test(trimmed) ? `#${trimmed}` : trimmed)
  return parsed === undefined
    ? fallback
    : { red: parsed.r / 255, green: parsed.g / 255, blue: parsed.b / 255 }
}

export const channels = (color: Rgb): readonly number[] => [color.red, color.green, color.blue]

export const mixMatrix = (identity: readonly number[], target: readonly number[], amount: number): string =>
  identity.map((value, index) => value + ((target[index] ?? 0) - value) * clamp(amount, 0, 1)).join(' ')
