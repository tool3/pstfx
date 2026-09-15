import { vctrfx, brightness } from '../../src/index.ts'
import { render } from '../support.ts'

render('brightness', 'logo.svg', (source) => vctrfx(source, [brightness({ amount: 1.35 })]))
