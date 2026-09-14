import { vctrfx, duotone } from '../../src/index.ts'
import { render } from '../support.ts'

render('duotone', 'tones.svg', (source) => vctrfx(source, [duotone({ shadow: '#111d4a', highlight: '#ffd166' })]))
