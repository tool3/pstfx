import { vctrfx, crt } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('matrix.svg')

const output = vctrfx(
  source,
  [
    crt()
  ],
  { seed: 'dvd' },
)

save('matrix-layered', source, output)
