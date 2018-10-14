import BuildingBlock from '../building-block'
import { exec } from '../util/child-process-promise'
import * as unicodes from '../util/unicodes'
import padText from '../util/pad-text'

const padRemaining = padText({ padStart: true })

class Battery extends BuildingBlock {
  name = 'Battery'
  update = async () => {
    const { stdout } = await exec('acpi -b')
    const batteries = stdout
      .split('\n')
      .filter((_, i) => i < 2)
      .map((info, i) => {
        const [percent] = info.match(/\d+%/).map(parseInt)
        const active = Boolean(info.match(/Discharging|Charging/))
        const remaining =
          active && info.replace(/.+\d+%, /, '').replace(/ .*/, '')
        const status = info.includes('Charging') ? 'CHR' : 'BAT'
        return { percent, active, remaining, status }
      })
    return batteries
  }
  render = batteries =>
    batteries.map(({ percent, active, remaining, status }, i) => ({
      name: `bat-${i}`,
      full_text: `${
        active ? unicodes.lightningBolt.padEnd(2) : ''
      }${status} ${percent}%${padRemaining(remaining)}`,
      color:
        percent < this.config.sick_threshold
          ? this.colors.sick
          : this.colors.normal
    }))
}

export default Battery
