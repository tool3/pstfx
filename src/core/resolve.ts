import { vctrfx } from './api.ts'
import { parseEffectString } from './dsl.ts'
import { isEffect } from './effect.ts'
import { invalidEffectSpec, unknownEffect } from './errors.ts'
import { REGISTERED_NAMES, canonicalName, findFactory } from './registry.ts'
import type { EffectOptions } from './registry.ts'
import type { Effect, VctrfxSettings } from './types.ts'

export type EffectSpec = string | Effect | Readonly<Record<string, EffectOptions | boolean | null | undefined>>

export type EffectsList = string | Effect | readonly EffectSpec[]

export interface EffectsConfig extends VctrfxSettings {
  readonly use: EffectsList
}

export type EffectsInput = EffectsList | EffectsConfig

export interface ResolvedEffects {
  readonly effects: readonly Effect[]
  readonly settings: VctrfxSettings
}

const distance = (from: string, to: string): number => {
  const rows = [...to].reduce<readonly number[]>(
    (previous, target, index) =>
      [...from].reduce<readonly number[]>(
        (row, source, column) => [
          ...row,
          Math.min(
            (row[column] ?? 0) + 1,
            (previous[column + 1] ?? 0) + 1,
            (previous[column] ?? 0) + (source === target ? 0 : 1),
          ),
        ],
        [index + 1],
      ),
    Array.from({ length: from.length + 1 }, (_, index) => index),
  )
  return rows[from.length] ?? from.length
}

const suggest = (name: string): string | undefined => {
  const ranked = REGISTERED_NAMES.map((candidate) => ({
    candidate,
    score: distance(name.toLowerCase(), candidate.toLowerCase()),
  })).sort((a, b) => a.score - b.score)[0]
  return ranked !== undefined && ranked.score <= Math.max(2, Math.ceil(name.length / 3))
    ? ranked.candidate
    : undefined
}

const build = (name: string, options: EffectOptions): Effect => {
  const factory = findFactory(name)
  if (factory === undefined) throw unknownEffect(name, suggest(name))
  return Object.keys(options).length === 0 ? factory() : factory(options)
}

const isPlainObject = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const fromRecord = (spec: Readonly<Record<string, unknown>>): readonly Effect[] =>
  Object.entries(spec).map(([name, options]) =>
    build(name, isPlainObject(options) ? options : {}),
  )

const fromSpec = (spec: EffectSpec): readonly Effect[] => {
  if (typeof spec === 'string') return fromString(spec)
  if (isEffect(spec)) return [spec]
  if (isPlainObject(spec)) return fromRecord(spec)
  throw invalidEffectSpec(typeof spec)
}

const fromString = (source: string): readonly Effect[] =>
  parseEffectString(source).map((entry) => build(entry.name, entry.options))

const isConfig = (input: EffectsInput): input is EffectsConfig =>
  isPlainObject(input) && !isEffect(input) && 'use' in input

const listToEffects = (list: EffectsList): readonly Effect[] =>
  typeof list === 'string'
    ? fromString(list)
    : isEffect(list)
      ? [list]
      : list.flatMap(fromSpec)

/**
 * Turn any accepted `effects` value into the vctrfx effects it names, plus any
 * settings that travelled with it.
 */
export const resolveEffects = (input: EffectsInput | null | undefined): ResolvedEffects => {
  if (input === null || input === undefined) return { effects: [], settings: {} }
  if (!isConfig(input)) return { effects: listToEffects(input), settings: {} }
  const { use, ...settings } = input
  return { effects: listToEffects(use), settings }
}

/**
 * Post-process an SVG with a declarative effect list. `defaults` are the host's
 * own settings; anything written on the effects value wins over them.
 */
export const applyEffects = (
  source: string,
  input: EffectsInput | null | undefined,
  defaults: VctrfxSettings = {},
): string => {
  const { effects, settings } = resolveEffects(input)
  return effects.length === 0 ? source : vctrfx(source, effects, { ...defaults, ...settings })
}

export const effectNames = (): readonly string[] => REGISTERED_NAMES

export const resolveEffectName = (name: string): string | undefined => canonicalName(name)
