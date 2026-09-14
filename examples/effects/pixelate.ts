import { vctrfx, pixelate } from '../../src/index.ts'
import { render } from '../support.ts'

render('pixelate', 'mark.svg', (source) => vctrfx(source, [pixelate({ size: 10 })]))
