#!/usr/bin/env node

const minimist = require('minimist')
const statusCommand = require('../dist/main').default

const usage = () => `usage: i3status-rx <config file path>

  --plugins     path to a js file an object of custom blocks
  --verbose`

const args = process.argv.slice(2)
const {
  _: [config],
  plugins,
  verbose,
  help
} = minimist(args)

if (help) {
  console.log(usage())
} else {
  statusCommand({ configPath: config, pluginPath: plugins, verbose })
}

process.title = `i3status-rx ${args.join(' ')}`
