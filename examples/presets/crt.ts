import { vctrfx, crt } from '../../src/index.ts'
import { render } from '../support.ts'

render('crt', 'scene.svg', (source) => vctrfx(source, [crt()]))
