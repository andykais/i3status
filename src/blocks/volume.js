import BuildingBlock from '../building-block'
import { exec } from '../util/child-process-promise'

const reInfo = /[a-z][a-z ]*\: Playback [0-9-]+ \[([0-9]+)\%\] (?:[[0-9\.-]+dB\] )?\[(on|off)\]/i

class Volume extends BuildingBlock {
  static block = 'Volume'

  update = async prevState => {
    const { stdout } = await exec('amixer get Master')

    const [_, volume, state] = stdout.match(reInfo)
    return { volume, state }
  }
  render = ({ volume, state }) => [
    {
      full_text: (state === 'on' ? volume : '0') + '%',
      color: state === 'on' ? this.colors.normal : this.colors.uneasy
    }
  ]
}
export default Volume
