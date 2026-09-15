import { vctrfx, cyberpunk } from '../../src/index.ts'
import { render } from '../support.ts'

render('cyberpunk', 'logo.svg', (source) => vctrfx(source, [cyberpunk()]))
