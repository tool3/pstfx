import { vctrfx, contrast } from '../../src/index.ts'
import { render } from '../support.ts'

render('contrast', 'scene.svg', (source) => vctrfx(source, [contrast({ amount: 1.7 })]))
