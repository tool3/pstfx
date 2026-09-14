import { vctrfx, riso } from '../../src/index.ts'
import { render } from '../support.ts'

render('riso', 'scene.svg', (source) => vctrfx(source, [riso({ shadow: '#2b3a67', highlight: '#ff5a5f' })]))
