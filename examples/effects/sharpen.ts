import { vctrfx, sharpen } from '../../src/index.ts'
import { render } from '../support.ts'

render('sharpen', 'scene.svg', (source) => vctrfx(source, [sharpen({ amount: 4 })]))
