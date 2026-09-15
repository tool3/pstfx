import { vctrfx, film } from '../../src/index.ts'
import { render } from '../support.ts'

render('film-3d', 'motion.svg', (source) => vctrfx(source, [film({ grain: { size: 1.2, animate: true } })]))
