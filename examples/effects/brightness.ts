import { vctrfx, brightness } from '../../src/index.ts'
import { render } from '../support.ts'

render('brightness', 'scene.svg', (source) => vctrfx(source, [brightness({ amount: 1.35 })]))
