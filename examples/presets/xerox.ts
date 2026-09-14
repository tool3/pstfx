import { vctrfx, xerox } from '../../src/index.ts'
import { render } from '../support.ts'

render('xerox', 'tones.svg', (source) => vctrfx(source, [xerox()]))
