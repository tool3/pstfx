import { vctrfx, hueRotate } from '../../src/index.ts'
import { render } from '../support.ts'

render('hue-rotate', 'logo.svg', (source) => vctrfx(source, [hueRotate({ angle: 140 })]))
