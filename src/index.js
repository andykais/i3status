import 'source-map-support/register'
import { blocks as builtInBlocks } from './blocks'
import { getStatusObservable } from './status'
import { parseConfig } from './config'

export default ({ configPath, pluginPath, verbose }) => {
  console.debug = verbose ? (...args) => console.log(...args) : () => {}
  console.status = !verbose ? (...args) => console.log(...args) : () => {}

  const config = parseConfig(configPath)

  // const pluginBlocks = require('pluginPath')
  const pluginBlocks = []

  const blocks = { ...builtInBlocks, ...pluginBlocks }

  const statusObservable = getStatusObservable(config, blocks)

  console.status(JSON.stringify({ version: 1 }) + '[\n[]')
  statusObservable.subscribe(console.status)
}
