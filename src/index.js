import sourceMapSupport from 'source-map-support'
import blockClasses from './blocks'
import getStatusObservable from './status'
import parseConfig from './config'
sourceMapSupport.install()

export default ({ configPath, pluginPath, verbose }) => {
  console.debug = verbose ? (...args) => console.log(...args) : () => {}
  console.status = !verbose ? (...args) => console.log(...args) : () => {}

  const config = parseConfig(configPath)

  // const pluginBlocks = require('pluginPath')

  const blocks = config.block.map(b => blockClasses[b.block])

  const statusObservable = getStatusObservable(blocks, config)

  console.status(JSON.stringify({ version: 1 }) + '[\n[]')
  statusObservable.subscribe(console.status)
}
