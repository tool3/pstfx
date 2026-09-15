import { vctrfx, tint } from '../../src/index.ts'
import { render } from '../support.ts'

render('tint', 'logo.svg', (source) => vctrfx(source, [tint({ color: '#00f5d4', amount: 0.5 })]))
