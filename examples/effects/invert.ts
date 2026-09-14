import { vctrfx, invert } from '../../src/index.ts'
import { render } from '../support.ts'

render('invert', 'scene.svg', (source) => vctrfx(source, [invert()]))
