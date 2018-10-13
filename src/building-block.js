import { Subject, interval, merge } from 'rxjs'
import { map, tap, skipWhile } from 'rxjs/operators'
import { createStore } from 'undux'
import fromSignal from './util/signal-observable'

/*
 * -== THE TWO TRUTHS OF BLOCKS ==-
 * 1. Only render when status bar is being printed.
 * 2. Update values in each blocks separate interval
 */

class BuildingBlock {
  // TODO make a singleton for a type of block so there is a possibility to execute once for all of them
  store = createStore({
    previousUpdate: null,
    currentUpdate: {},
    renderOutput: {}
  })
  constructor(config, blockConfig) {
    this.colors = config.colors
    this.showIcons = blockConfig.icons === undefined ? config.icons : blockConfig.icons
    this.icon = this.showIcons ? v => v : () => ''

    this.interval = blockConfig.interval || config.interval
    this.update_on_signal = blockConfig.update_on_signal

    this.config = {
      ...config,
      ...blockConfig
    }
  }

  callUpdate = async () => {
    // const start = process.hrtime()
    const previousUpdate = this.store.get('currentUpdate')
    const currentUpdate = await this.update(previousUpdate)
    this.store.set('previousUpdate')(previousUpdate)
    this.store.set('currentUpdate')(currentUpdate)
    // const end = process.hrtime(start)
    // console.debug(this.name.padEnd(8), (end[0] + end[1] / 1e9).toFixed(3), 'seconds')
  }
  callRender = () => {
    const renderOutput = this.getRender()
    return renderOutput.map(output => ({
      // name: this.name,
      separator_block_width: this.config.padding,
      ...output
    }))
  }
  getRender = () => {
    const previousUpdate = this.store.get('previousUpdate')
    const currentUpdate = this.store.get('currentUpdate')

    if (previousUpdate === null) {
      return []
    } else if (previousUpdate !== currentUpdate) {
      const renderOutput = this.render(currentUpdate)
      this.store.set('renderOutput')(renderOutput)
      return renderOutput
    } else {
      return this.store.get('renderOutput')
    }
  }
}

export default BuildingBlock
