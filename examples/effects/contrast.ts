import { vctrfx, contrast } from '../../src/index.ts'
import { render } from '../support.ts'

render('contrast', 'logo.svg', (source) => vctrfx(source, [contrast({ amount: 1.7 })]))
