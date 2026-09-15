import { vctrfx, vignette } from '../../src/index.ts'
import { render } from '../support.ts'

render('vignette', 'logo.svg', (source) => vctrfx(source, [vignette({ amount: 0.8, radius: 0.5 })]))
