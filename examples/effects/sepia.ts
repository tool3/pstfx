import { vctrfx, sepia } from '../../src/index.ts'
import { render } from '../support.ts'

render('sepia', 'logo.svg', (source) => vctrfx(source, [sepia()]))
