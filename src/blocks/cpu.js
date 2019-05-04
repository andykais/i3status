import os from 'os'
import BuildingBlock from '../building-block'
import * as unicodes from '../util/unicodes'
import { padText } from '../util/pad-text'

const padCores = padText({ padStart: true })

class CPU extends BuildingBlock {
    static block = 'CPU'

    update = ({ oldCores = [] }) => {
        let average = 0
        const cores = os.cpus()
        const coresText = cores.map((core, i) => {
            const prevCore = oldCores[i] || {
                times: {
                    user: 0,
                    nice: 0,
                    irq: 0,
                    sys: 0,
                    idle: 0
                }
            }
            const coreChanged= Object.keys(core.times).reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: core.times[key] - prevCore.times[key]
                }),
                {} 
            )
            const { user, nice, idle, irq, sys } = coreChanged
            const coreAverage = (user + nice + irq + sys) / (user + nice + idle + irq + sys) * 100
            
            
            // const active =
            //       core.times.user +
            //       core.times.nice +
            //       core.times.irq +
            //       core.times.sys -
            //       prevCore.times.user +
            //       prevCore.times.nice +
            //       prevCore.times.irq +
            //       prevCore.times.sys
            // const idle = core.times.idle - prevCore.times.idle
            // const coreAverage = ((active) / (active + idle)) * 100
            average += coreAverage
            // console.log({ average })
            const unicode = unicodes.capacity(coreAverage)
            return unicode
        })

        return { average: average / coresText.length, coresText: coresText.join(' '), oldCores: cores }
        // return {
        // name: 'cpu',
        // full_text: `CPU ${average.toFixed(2)}%${optional(coresText)}`,
        // color: average > DANGER_THRESHOLDS.cpu ? colors.sick : colors.normal
        // }
    }

    render = ({ average, coresText }) => [
        {
            full_text: `CPU ${average.toFixed(2)}%${padCores(this.icon(coresText))}`,
            color:
            average > this.config.sick_threshold
                ? this.colors.sick
                : this.colors.normal
        }
    ]
}
export default CPU
