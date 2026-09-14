import { vctrfx, scanlines } from '../../src/index.ts'
import { render } from '../support.ts'

render('scanlines', 'scene.svg', (source) => vctrfx(source, [scanlines({ gap: 3, thickness: 1.2, opacity: 0.35 })]))
