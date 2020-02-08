#!/usr/bin/env node

// const minimist = require('minimist')
// const statusCommand = require('../dist/main').default
// const statusCommand = require('../src/index.js').default
import minimist from 'minimist'
import statusCommand from '../src/index.js'

const usage = () => `usage: i3status-rx <config file path>

  --plugins     path to a js file an object of custom blocks
  --debug`

const args = process.argv.slice(2)
const {
  _: [config],
  plugins,
  debug,
  help
} = minimist(args)

if (help) {
  console.log(usage())
} else {
  statusCommand({ configPath: config, pluginPath: plugins, debug })
}

process.title = `i3status-rx ${args.join(' ')}`
