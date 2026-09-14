import { vctrfx, fade } from '../../src/index.ts'
import { render } from '../support.ts'

render('fade', 'mark.svg', (source) => vctrfx(source, [fade({ amount: 0.45 })]))
