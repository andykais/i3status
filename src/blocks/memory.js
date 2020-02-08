import os from 'os'
import { exec } from '../util/child-process-promise.js'
import BuildingBlock from '../building-block.js'

import { humanSizes } from '../util/human-readable.js'
import { parseTable } from '../util/parse-table.js'

const parseFreeTable = parseTable(
  [null, 'total', 'used', 'free', 'shared', 'buff-cache', 'available'],
  parseInt
)
// const parseDiskTable = parseTable([null, 'size', 'used', 'available', 'usePercent'], parseInt)

class Memory extends BuildingBlock {
  static block = 'Memory'

  update = async () => {
    const { stdout } = await exec('free')
    // console.debug(stdout)

    // const [_header, systemMem] = stdout.split('\n', 2)
    const [_header, systemMem] = parseFreeTable(stdout)
    const { total, available } = systemMem
    // console.log(parseFreeTable(systemMem))

    console.debug(total, available, (total - available) / 100)
    return {
      total: humanSizes(total, { givenUnit: 'K' }),
      available: humanSizes(available, { givenUnit: 'K' }),
      percent: (total - available) / total * 100
    }

    return { percent: 0, available: 0, used: 0 }
    // const total = os.totalmem() / 1e9
    // const available = os.freemem() / 1e9
    // const used = total - available
    // const percent = (used / total) * 100

    // return { percent, available, used }
  }
  render = ({ percent, available }) => [
    {
      full_text: `MEM ${available} ${percent.toFixed(2)}%`,
      // full_text: `MEM ${used.toFixed(1)}G ${percent.toFixed(2)}%`,
      color: percent > this.config.sick_threshold ? this.colors.sick : this.colors.normal
    }
  ]
}
export { Memory }
