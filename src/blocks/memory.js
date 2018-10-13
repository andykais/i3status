import os from 'os'
import BuildingBlock from '../building-block'

class Memory extends BuildingBlock {
  name = 'Memory'

  update = () => {
    const total = os.totalmem() / 1e9
    const available = os.freemem()
    const used = total - available / 1e9
    const percent = (used / total) * 100

    return { percent, available, used }
  }
  render = ({ percent, used }) => [
    {
      full_text: `MEM ${used.toFixed(1)}G ${percent.toFixed(2)}%`,
      color:
        percent > this.config.sick_threshold
          ? this.colors.sick
          : this.colors.normal
    }
  ]
}
export default Memory
