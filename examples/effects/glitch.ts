import { vctrfx, glitch } from '../../src/index.ts'
import { render } from '../support.ts'

render('glitch', 'scene.svg', (source) => vctrfx(source, [glitch({ intensity: 0.8, slices: 10 })]))
