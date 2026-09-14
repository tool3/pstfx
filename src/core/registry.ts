import { bloom } from '../effects/bloom.ts'
import { blur } from '../effects/blur.ts'
import { chromaticAberration } from '../effects/chromatic.ts'
import {
  brightness,
  contrast,
  duotone,
  fade,
  grayscale,
  hueRotate,
  invert,
  posterize,
  saturate,
  sepia,
  threshold,
  tint,
} from '../effects/color.ts'
import { glitch } from '../effects/glitch.ts'
import { glow } from '../effects/glow.ts'
import { grain } from '../effects/grain.ts'
import { halftone } from '../effects/halftone.ts'
import { outline } from '../effects/outline.ts'
import { pixelate } from '../effects/pixelate.ts'
import { emboss, sharpen } from '../effects/relief.ts'
import { scanlines } from '../effects/scanlines.ts'
import { shadow } from '../effects/shadow.ts'
import { vignette } from '../effects/vignette.ts'
import { wave } from '../effects/wave.ts'
import { crt, cyberpunk, film, neon, newsprint, riso, vhs, xerox } from '../presets/index.ts'
import type { Effect } from './types.ts'

export type EffectOptions = Readonly<Record<string, unknown>>

export type EffectFactory = (options?: EffectOptions) => Effect

// Every factory takes its own options interface; the registry erases that to a
// single shape so a parsed name can reach any of them.
const entry = <Options>(build: (options?: Options) => Effect): EffectFactory =>
  (options) => build(options as Options | undefined)

export const EFFECT_FACTORIES = {
  blur: entry(blur),
  bloom: entry(bloom),
  glow: entry(glow),
  shadow: entry(shadow),
  grayscale: entry(grayscale),
  saturate: entry(saturate),
  hueRotate: entry(hueRotate),
  invert: entry(invert),
  brightness: entry(brightness),
  contrast: entry(contrast),
  sepia: entry(sepia),
  fade: entry(fade),
  posterize: entry(posterize),
  threshold: entry(threshold),
  duotone: entry(duotone),
  tint: entry(tint),
  grain: entry(grain),
  scanlines: entry(scanlines),
  chromaticAberration: entry(chromaticAberration),
  glitch: entry(glitch),
  pixelate: entry(pixelate),
  halftone: entry(halftone),
  vignette: entry(vignette),
  outline: entry(outline),
  wave: entry(wave),
  emboss: entry(emboss),
  sharpen: entry(sharpen),
} as const satisfies Readonly<Record<string, EffectFactory>>

export const PRESET_FACTORIES = {
  crt: entry(crt),
  vhs: entry(vhs),
  riso: entry(riso),
  xerox: entry(xerox),
  neon: entry(neon),
  film: entry(film),
  newsprint: entry(newsprint),
  cyberpunk: entry(cyberpunk),
} as const satisfies Readonly<Record<string, EffectFactory>>

export type EffectName = keyof typeof EFFECT_FACTORIES
export type PresetName = keyof typeof PRESET_FACTORIES

export const EFFECT_NAMES = Object.keys(EFFECT_FACTORIES) as readonly EffectName[]
export const PRESET_NAMES = Object.keys(PRESET_FACTORIES) as readonly PresetName[]

const REGISTRY = { ...EFFECT_FACTORIES, ...PRESET_FACTORIES }

export type RegisteredName = keyof typeof REGISTRY

export const REGISTERED_NAMES = Object.keys(REGISTRY) as readonly RegisteredName[]

const ALIASES = {
  greyscale: 'grayscale',
  grey: 'grayscale',
  gray: 'grayscale',
  hue: 'hueRotate',
  chromatic: 'chromaticAberration',
  aberration: 'chromaticAberration',
  dropshadow: 'shadow',
  noise: 'grain',
  stroke: 'outline',
  photocopy: 'xerox',
  risograph: 'riso',
} as const satisfies Readonly<Record<string, RegisteredName>>

const fold = (name: string): string => name.toLowerCase().replace(/[^a-z0-9]/g, '')

const NAMED: readonly (readonly [string, RegisteredName])[] = [
  ...REGISTERED_NAMES.map((name) => [fold(name), name] as const),
  ...Object.entries(ALIASES).map(([alias, name]) => [fold(alias), name] as const),
]

const LOOKUP: Readonly<Record<string, EffectFactory | undefined>> = Object.fromEntries(
  NAMED.map(([key, name]) => [key, REGISTRY[name]]),
)

const CANONICAL: Readonly<Record<string, string | undefined>> = Object.fromEntries(NAMED)

export const findFactory = (name: string): EffectFactory | undefined => LOOKUP[fold(name)]

export const canonicalName = (name: string): string | undefined => CANONICAL[fold(name)]

export const isRegisteredEffect = (name: string): boolean => findFactory(name) !== undefined
