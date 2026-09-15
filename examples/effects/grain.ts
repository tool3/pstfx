import { vctrfx, grain } from '../../src/index.ts'
import { render } from '../support.ts'

render('grain', 'logo.svg', (source) => vctrfx(source, [grain({ amount: 0.5 })]))
