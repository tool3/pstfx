export type VctrfxErrorCode = 'INVALID_SOURCE' | 'NOT_AN_SVG' | 'MALFORMED_MARKUP' | 'INVALID_EFFECT'

export class VctrfxError extends Error {
  readonly code: VctrfxErrorCode

  constructor(code: VctrfxErrorCode, message: string) {
    super(message)
    this.name = 'VctrfxError'
    this.code = code
  }
}

export const invalidSource = (received: string): VctrfxError =>
  new VctrfxError('INVALID_SOURCE', `Expected an SVG string, received ${received}.`)

export const notAnSvg = (rootName: string | null): VctrfxError =>
  new VctrfxError(
    'NOT_AN_SVG',
    rootName === null
      ? 'No root element found. The source must contain an <svg> element.'
      : `Expected <svg> as the root element, found <${rootName}>.`,
  )

export const malformedMarkup = (detail: string): VctrfxError =>
  new VctrfxError('MALFORMED_MARKUP', `Could not parse the SVG: ${detail}.`)

export const invalidEffect = (position: number): VctrfxError =>
  new VctrfxError('INVALID_EFFECT', `Effect at index ${position} is not a valid effect.`)
