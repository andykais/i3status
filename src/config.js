import { resolve } from 'path'
import { readFileSync } from 'fs'
import * as toml from 'toml'

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
  const userConfig = configFile
    ? readConfig(resolve(process.cwd(), configFile))
    : null

  const defaultConfig = readConfig(resolve(__dirname, '../default-config.toml'))

  const mergedGlobalConfigs = { ...defaultConfig, ...userConfig }

  return {
    ...mergedGlobalConfigs,
    interval: mergedGlobalConfigs.interval,
    block: mergeBlockConfigs(defaultConfig, userConfig)
  }
}
