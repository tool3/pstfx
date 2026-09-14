import { vctrfx, shadow } from '../../src/index.ts'
import { render } from '../support.ts'

render('shadow', 'mark.svg', (source) => vctrfx(source, [shadow({ x: 6, y: 8, blur: 6, opacity: 0.55 })]))
