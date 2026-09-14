import { vctrfx, cyberpunk } from '../../src/index.ts'
import { render } from '../support.ts'

render('cyberpunk', 'scene.svg', (source) => vctrfx(source, [cyberpunk()]))
