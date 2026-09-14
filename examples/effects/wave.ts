import { vctrfx, wave } from '../../src/index.ts'
import { render } from '../support.ts'

render('wave', 'mark.svg', (source) => vctrfx(source, [wave({ amplitude: 16, frequency: 0.03 })]))
