import BuildingBlock from '../building-block'
import { exec } from '../util/child-process-promise'
import * as unicodes from '../util/unicodes'
import padText from '../util/pad-text'

const padRemaining = padText({ padStart: true })

const rePercentage = /\d+%/
const reActive = /Discharging|Charging/
const reRemaining = /\d\d:\d\d:\d\d/

class Battery extends BuildingBlock {
  name = 'Battery'
  update = async () => {
    const { stdout } = await exec('acpi -b')
    const batteries = stdout
      .trim()
      .split('\n')
      .map((info, i) => {
        const [percent] = info.match(rePercentage).map(parseInt)
        const active = Boolean(info.match(reActive))
        const remaining = info.match(reRemaining) || ['']
        // const remaining =
        // active && info.replace(/.+\d+%, /, '').replace(/ .*/, '')
        const status = info.includes('Charging') ? 'CHR' : 'BAT'
        return { percent, active, remaining: remaining[0], status }
      })
    return batteries
  }
  render = batteries =>
    batteries.map(({ percent, active, remaining, status }, i) => {
      // console.debug({ remaining })
      return {
        name: `bat-${i}`,
        full_text: `${this.icon(
          active ? unicodes.lightningBolt.padEnd(2) : ''
        )}${status} ${percent}%${padRemaining(remaining)}`,
        color:
          percent < this.config.sick_threshold
            ? this.colors.sick
            : this.colors.normal
      }
    })
}

export default Battery
