import { vctrfx, glow } from '../../src/index.ts'
import { render } from '../support.ts'

render('glow', 'mark.svg', (source) => vctrfx(source, [glow({ color: '#ff2d55', radius: 8, intensity: 1.5 })]))
