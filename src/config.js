import { fileURLToPath } from 'url'
import * as path from 'path'
import { readFileSync } from 'fs'
import toml from 'toml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const mergeBlockConfigs = (defaultConfig, userConfig) => {
  if (!userConfig) return defaultConfig.block
  return userConfig.block.map(b => ({
    ...defaultConfig.block.find(defaultBlock => defaultBlock.block === b.block),
    ...b
  }))
}

const readConfig = tomlFile => {
  const tomlStr = readFileSync(tomlFile).toString()
  const config = toml.parse(tomlStr)

  return config
}

export const parseConfig = configFile => {
  const userConfig = configFile ? readConfig(path.resolve(process.cwd(), configFile)) : null

  const defaultConfig = readConfig(path.resolve(__dirname, '../default-config.toml'))

  const mergedGlobalConfigs = { ...defaultConfig, ...userConfig }

  return {
    ...mergedGlobalConfigs,
    interval: mergedGlobalConfigs.interval,
    block: mergeBlockConfigs(defaultConfig, userConfig)
  }
}
