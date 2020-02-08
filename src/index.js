// import { blocks as builtInBlocks } from './blocks/index.js'
import * as builtInBlocks from './blocks/index.js'
import { getStatusObservable } from './status.js'
import { parseConfig } from './config.js'

export default ({ configPath, pluginPath, debug }) => {
  console.debug = debug ? (...args) => console.log(...args) : () => {}
  console.status = !debug ? (...args) => console.log(...args) : () => {}

  const config = parseConfig(configPath)

  // const pluginBlocks = require('pluginPath')
  const pluginBlocks = []

  const blocks = { ...builtInBlocks, ...pluginBlocks }

  const statusObservable = getStatusObservable(config, blocks)

  console.status(JSON.stringify({ version: 1 }) + '[\n[]')
  statusObservable.subscribe(console.status)
}
