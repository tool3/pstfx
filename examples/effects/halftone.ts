import { vctrfx, halftone } from '../../src/index.ts'
import { render } from '../support.ts'

render('halftone', 'tones.svg', (source) => vctrfx(source, [halftone({ size: 5, angle: 15 })]))
