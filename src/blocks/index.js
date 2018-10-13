import Volume from './volume'
import Battery from './battery'
import DateTime from './datetime'
import Disk from './disk'
import Network from './network'
import CPU from './cpu'
import Memory from './memory'
import Temperature from './temperature'

export default {
  [Volume.name]: Volume,
  [Battery.name]: Battery,
  [DateTime.name]: DateTime,
  [Disk.name]: Disk,
  [Network.name]: Network,
  [CPU.name]: CPU,
  [Memory.name]: Memory,
  [Temperature.name]: Temperature
}
