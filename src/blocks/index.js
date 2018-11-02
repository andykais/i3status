import Volume from './volume'
import Battery from './battery'
import DateTime from './datetime'
import Disk from './disk'
import Network from './network'
import CPU from './cpu'
import Memory from './memory'
import Temperature from './temperature'

export const blocks = {
  [Volume.block]: Volume,
  [Battery.block]: Battery,
  [DateTime.block]: DateTime,
  [Disk.block]: Disk,
  [Network.block]: Network,
  [CPU.block]: CPU,
  [Memory.block]: Memory,
  [Temperature.block]: Temperature
}
