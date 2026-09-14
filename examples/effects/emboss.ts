import { vctrfx, emboss } from '../../src/index.ts'
import { render } from '../support.ts'

render('emboss', 'mark.svg', (source) => vctrfx(source, [emboss({ depth: 1.4 })]))
