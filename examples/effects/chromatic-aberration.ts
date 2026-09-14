import { vctrfx, chromaticAberration } from '../../src/index.ts'
import { render } from '../support.ts'

render('chromatic-aberration', 'scene.svg', (source) => vctrfx(source, [chromaticAberration({ offset: 1 })]))
