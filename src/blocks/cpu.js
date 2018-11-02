import os from 'os'
import BuildingBlock from '../building-block'
import * as unicodes from '../util/unicodes'
import { padText } from '../util/pad-text'

const padCores = padText({ padStart: true })

class CPU extends BuildingBlock {
  static block = 'CPU'

  update = () => {
    const cores = os
      .cpus()
      .map(
        ({ times: { user, nice, idle } }) =>
          ((user + nice) * 100) / (user + nice + idle)
      )
    const avg = cores.reduce((acc, c) => c + acc, 0) / cores.length

    const maxCore = Math.max(...cores)
    // relative distance
    // const coresText = avg > DANGER_THRESHOLDS.cpu && normalize(cores).map(unicodes.capacity).join(' ')
    // out of 100 distance
    const coresText =
      cores.find(c => unicodes.capacity(c) !== unicodes.capacity(0)) &&
      cores.map(unicodes.capacity).join(' ')

    return { avg, coresText }
    // return {
    // name: 'cpu',
    // full_text: `CPU ${avg.toFixed(2)}%${optional(coresText)}`,
    // color: avg > DANGER_THRESHOLDS.cpu ? colors.sick : colors.normal
    // }
  }

  render = ({ avg, coresText }) => [
    {
      full_text: `CPU ${avg.toFixed(2)}%${padCores(this.icon(coresText))}`,
      color:
        avg > this.config.sick_threshold ? this.colors.sick : this.colors.normal
    }
  ]
}
export default CPU
