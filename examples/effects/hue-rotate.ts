import { vctrfx, hueRotate } from '../../src/index.ts'
import { render } from '../support.ts'

render('hue-rotate', 'scene.svg', (source) => vctrfx(source, [hueRotate({ angle: 140 })]))
