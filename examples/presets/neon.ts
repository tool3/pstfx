import { vctrfx, neon } from '../../src/index.ts'
import { render } from '../support.ts'

render('neon', 'mark.svg', (source) => vctrfx(source, [neon({ color: '#4cc9f0' })]))
