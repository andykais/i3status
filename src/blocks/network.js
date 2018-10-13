import os from 'os'
import Handlebars from 'handlebars'
import BuildingBlock from '../building-block'
import parseTable from '../util/parse-table'
import { exec } from '../util/child-process-promise'
import { readFile } from '../util/fs-promise'
import { humanSizes } from '../util/human-readable'
import * as unicodes from '../util/unicodes'

const parseNetworkTable = parseTable(
  [null, 'device', null, null, null, null, null, null, 'state'],
  item => item.replace(/:$/, ':')
)
const reBytes = /RX:.*?[\n\r]\s*(\d+)[\s\S]+TX:.*?[\r\n]\s*(\d+)/
const reIpv4 = /inet\s(.*?)\//
const reIpv6 = /inet6\s(.*?)\//

const reDevice = /(^|[\n\r])\d+:\s/

class Network extends BuildingBlock {
  name = 'Network'

  constructor(config, blockConfig) {
    super(config, blockConfig)
    this.template = Handlebars.compile(blockConfig.template)
  }

  // TODO wire up to run once for all Networks
  static io = async () => {
    const [status, ssid] = await Promise.all([
      exec(`ip -s addr`),
      exec('iwgetid -r')
    ])
    const statuses = status.stdout.split(reDevice).splice(2)
    return { statuses, ssid }
  }

  update = async ({
    totalBytesDown: prevBytesDown = 0,
    totalBytesUp: prevBytesUp = 0
  }) =>
    // { statuses, ssid }
    {
      // const status = statuses.find(s => s.startsWith(this.config.device + ' '))
      try {
        const [status, ssid] = await Promise.all([
          exec(`ip -s addr show ${this.config.device}`),
          exec('iwgetid -r')
        ])
        const [{ state }] = parseNetworkTable(status.stdout)

        const [IPv4] = os.networkInterfaces()[this.config.device] || [
          { address: '' }
        ]

        const [_2, rBytes, tBytes] = status.stdout.match(reBytes)

        const totalBytesDown = parseInt(rBytes)
        const totalBytesUp = parseInt(tBytes)

        return {
          state,
          ssid: ssid.stdout.trim(),
          ipv4: IPv4.address,
          bytesUpPerInterval: totalBytesUp - prevBytesUp,
          bytesDownPerInterval: totalBytesDown - prevBytesDown,
          totalBytesDown,
          totalBytesUp
        }
      } catch (e) {
        return {
          state: 'DOWN'
        }
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
export default Network
