import { vctrfx, posterize } from '../../src/index.ts'
import { render } from '../support.ts'

render('posterize', 'logo.svg', (source) => vctrfx(source, [posterize({ steps: 4 })]))
