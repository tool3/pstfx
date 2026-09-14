import { vctrfx, blur } from '../../src/index.ts'
import { render } from '../support.ts'

render('blur', 'scene.svg', (source) => vctrfx(source, [blur({ radius: 4 })]))
