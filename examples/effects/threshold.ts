import { vctrfx, threshold } from '../../src/index.ts'
import { render } from '../support.ts'

render('threshold', 'tones.svg', (source) => vctrfx(source, [threshold({ level: 0.62, dark: '#101010', light: '#f6f4ef' })]))
