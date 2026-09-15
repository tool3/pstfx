import { vctrfx, vhs } from '../../src/index.ts'
import { render } from '../support.ts'

render('vhs', 'logo.svg', (source) => vctrfx(source, [vhs()]))
