import { vctrfx, saturate } from '../../src/index.ts'
import { render } from '../support.ts'

render('saturate', 'scene.svg', (source) => vctrfx(source, [saturate({ amount: 2.2 })]))
