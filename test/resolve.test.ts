import test from 'node:test'
import assert from 'node:assert/strict'
import { parseEffectString } from '../src/core/dsl.ts'
import { VctrfxError } from '../src/core/errors.ts'
import { applyEffects, resolveEffects } from '../src/core/resolve.ts'
import { grain, scanlines } from '../src/index.ts'
import { crt } from '../src/presets/index.ts'

const SOURCE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'

const names = (input: Parameters<typeof resolveEffects>[0]): readonly string[] =>
  resolveEffects(input).effects.map((effect) => effect.name)

test('a bare name resolves to that effect', () => {
  assert.deepEqual(names('crt'), ['crt'])
})

test('a string stack resolves in written order', () => {
  assert.deepEqual(names('scanlines grain'), ['scanlines', 'grain'])
  assert.deepEqual(names('scanlines, grain'), ['scanlines', 'grain'])
  assert.deepEqual(names('scanlines + grain'), ['scanlines', 'grain'])
})

test('parses arguments into an options object', () => {
  assert.deepEqual(parseEffectString('scanlines(gap:3,opacity:.35)'), [
    { name: 'scanlines', options: { gap: 3, opacity: 0.35 } },
  ])
})

test('reads every value form the syntax allows', () => {
  assert.deepEqual(parseEffectString("halftone(size = 5, color: #1c1c1c, background: none, keepSource, angle: -45, label: 'a, b')"), [
    {
      name: 'halftone',
      options: {
        size: 5,
        color: '#1c1c1c',
        background: null,
        keepSource: true,
        angle: -45,
        label: 'a, b',
      },
    },
  ])
})

test('dotted keys reach a preset’s inner effect', () => {
  assert.deepEqual(parseEffectString('crt(scanlines.gap: 3, scanlines.opacity: .5, animate: true)'), [
    { name: 'crt', options: { scanlines: { gap: 3, opacity: 0.5 }, animate: true } },
  ])
})

test('object specs and effect instances mix in one list', () => {
  assert.deepEqual(names([{ scanlines: { gap: 3 } }, 'grain', crt()]), ['scanlines', 'grain', 'crt'])
})

test('an effect instance passes through untouched', () => {
  const instance = grain({ amount: 0.4 })
  assert.equal(resolveEffects([instance]).effects[0], instance)
})

test('the config form carries settings alongside the stack', () => {
  const resolved = resolveEffects({ use: ['crt'], seed: 'hero', animate: false })
  assert.deepEqual(resolved.effects.map((effect) => effect.name), ['crt'])
  assert.deepEqual(resolved.settings, { seed: 'hero', animate: false })
})

test('names are matched loosely and through aliases', () => {
  assert.deepEqual(names('chromatic-aberration'), ['chromaticAberration'])
  assert.deepEqual(names('CHROMATIC'), ['chromaticAberration'])
  assert.deepEqual(names('greyscale'), ['grayscale'])
})

test('an unknown name throws with a suggestion', () => {
  assert.throws(
    () => resolveEffects('scanline'),
    (error: unknown) =>
      error instanceof VctrfxError &&
      error.code === 'UNKNOWN_EFFECT' &&
      error.message.includes('scanlines'),
  )
})

test('stray text is rejected rather than silently dropped', () => {
  assert.throws(
    () => resolveEffects('grain !! crt'),
    (error: unknown) => error instanceof VctrfxError && error.code === 'INVALID_EFFECT_SYNTAX',
  )
})

test('an empty or absent stack returns the source untouched', () => {
  assert.equal(applyEffects(SOURCE, undefined), SOURCE)
  assert.equal(applyEffects(SOURCE, ''), SOURCE)
  assert.equal(applyEffects(SOURCE, []), SOURCE)
})

test('the declarative path matches the imperative one byte for byte', () => {
  const declarative = applyEffects(SOURCE, 'scanlines(gap:3) grain(amount:.4)', { seed: 'x' })
  const imperative = applyEffects(SOURCE, [scanlines({ gap: 3 }), grain({ amount: 0.4 })], { seed: 'x' })
  assert.equal(declarative, imperative)
})

test('settings on the effects value win over the host defaults', () => {
  const withHostSeed = applyEffects(SOURCE, 'grain', { seed: 'host' })
  const overridden = applyEffects(SOURCE, { use: 'grain', seed: 'own' }, { seed: 'host' })
  assert.notEqual(withHostSeed, overridden)
  assert.equal(overridden, applyEffects(SOURCE, 'grain', { seed: 'own' }))
})
