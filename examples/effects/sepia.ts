import { vctrfx, sepia } from '../../src/index.ts'
import { render } from '../support.ts'

render('sepia', 'scene.svg', (source) => vctrfx(source, [sepia()]))
