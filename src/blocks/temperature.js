import BuildingBlock from '../building-block'
import { exec } from '../util/child-process-promise'
import * as unicodes from '../util/unicodes'

class Temperature extends BuildingBlock {
  static block = 'Temperature'

  update = async () => {
    const { stdout } = await exec('acpi -t')
    const [_1, _2, status, temp] = stdout.split(/\s+/)
    return { status, temp }
  }
  render = ({ status, temp }) => [
    {
      full_text: `TEMP ${temp} ${unicodes.degree}C`,
      color: status !== 'ok,' ? this.colors.sick : this.colors.normal
    }
  ]
}
export default Temperature
