import { vctrfx, grain } from '../../src/index.ts'
import { render } from '../support.ts'

render('grain', 'scene.svg', (source) => vctrfx(source, [grain({ amount: 0.5 })]))
