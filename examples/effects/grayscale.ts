import { vctrfx, grayscale } from '../../src/index.ts'
import { render } from '../support.ts'

render('grayscale', 'logo.svg', (source) => vctrfx(source, [grayscale()]))
