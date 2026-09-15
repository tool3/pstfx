import { vctrfx, crt } from '../../src/index.ts'
import { render } from '../support.ts'

render('crt', 'logo.svg', (source) => vctrfx(source, [crt()]))
