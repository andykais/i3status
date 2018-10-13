import * as cp from 'child_process'
import { promisify } from 'util'

export const exec = promisify(cp.exec)
