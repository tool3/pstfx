import { vctrfx, bloom } from '../../src/index.ts'
import { render } from '../support.ts'

render('bloom', 'logo.svg', (source) => vctrfx(source, [bloom({ radius: 8, threshold: 0.5 })]))
