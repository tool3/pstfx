import { vctrfx, sharpen } from '../../src/index.ts'
import { render } from '../support.ts'

render('sharpen', 'logo.svg', (source) => vctrfx(source, [sharpen({ amount: 4 })]))
