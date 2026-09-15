import { vctrfx, invert } from '../../src/index.ts'
import { render } from '../support.ts'

render('invert', 'logo.svg', (source) => vctrfx(source, [invert()]))
