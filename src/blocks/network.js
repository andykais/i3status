import os from 'os'
import Handlebars from 'handlebars'
import BuildingBlock from '../building-block.js'
import { exec } from '../util/child-process-promise.js'
import { humanSizes } from '../util/human-readable.js'
import * as unicodes from '../util/unicodes.js'
import { tupleToObject } from '../util/array.js'

const reSsid = /ESSID:"(.*?)"/

class Network extends BuildingBlock {
  static block = 'Network'

  constructor(config, blockConfig) {
    super(config, blockConfig)
    this.template = Handlebars.compile(blockConfig.template)
  }

  static update = async () => {
    const [statuses, iwStats] = await Promise.all([
      exec('ip -json -statistics addr'),
      exec('iwconfig')
    ])
    const wifiDevices = iwStats.stdout
      .split('\n\n')
      .map(deviceStr => {
        const components = deviceStr.split(' ')
        return [components.shift(), components.join(' ')]
      })
      .reduce(tupleToObject, {})

    return {
      statuses: JSON.parse(statuses.stdout),
      wifiDevices
    }
  }

  update = (
    { totalBytesDown: prevBytesDown = 0, totalBytesUp: prevBytesUp = 0 },
    { statuses, wifiDevices }
  ) => {
    const status = statuses.find(status => status.ifname === this.config.device)
    if (!status) return { state: 'DOWN' }

    const wifiStats = wifiDevices[this.config.device]

    const state = status.operstate
    const [IPv4] = os.networkInterfaces()[this.config.device] || [
      { address: '' }
    ]
    const { rx, tx } = status.stats64
    const totalBytesDown = rx.bytes
    const totalBytesUp = tx.bytes

    const [_, ssid] = wifiStats ? wifiStats.match(reSsid) || [] : []

    return {
      state,
      ssid,
      ipv4: IPv4.address,
      bytesUpPerInterval: totalBytesUp - prevBytesUp,
      bytesDownPerInterval: totalBytesDown - prevBytesDown,
      totalBytesDown,
      totalBytesUp
    }
  }
  render = ({
    state,
    ssid,
    ipv4,
    bytesUpPerInterval,
    bytesDownPerInterval,
    totalBytesDown
  }) => {
    const title = this.config.title ? `${this.config.title}: ` : ''

    if (state === 'UP' || state === 'UNKNOWN') {
      const interval = this.interval === 1 ? 's' : `${this.interval}s`
      // console.debug(humanSizes(bytesUpPerInterval))
      const bytesUp = `${humanSizes(bytesUpPerInterval)}${interval}`
      const bytesDown = `${humanSizes(bytesDownPerInterval)}${interval}`
      const totalDown = humanSizes(totalBytesDown)

      const humanBytesUp = humanSizes(bytesUpPerInterval)
      const humanBytesDown = humanSizes(bytesDownPerInterval)
      const humanTotalDown = humanSizes(totalBytesDown)

      return [
        {
          full_text: `${title}${unicodes.upload} ${humanBytesUp}b/${interval} ${
            unicodes.download
          } ${humanBytesDown}b/${interval} ${humanTotalDown}b at ${ssid}${ipv4}`,
          full_text: this.template({
            title,
            interval,
            bytesUp,
            bytesDown,
            totalDown,
            ssid,
            ipv4
          }),
          color: this.colors.healthy
        }
      ]
    } else {
      if (this.config.hide_if_down) {
        return []
      } else {
        return [
          {
            full_text: `${title}DOWN`,
            color: this.colors.sick
          }
        ]
      }
    }
  }
}
export { Network }
