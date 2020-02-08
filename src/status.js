// import { Observable, timer, merge } from 'rxjs'
import rxjs from 'rxjs'
// import { flatMap, map, filter, tap, skipWhile } from 'rxjs/operators/index.js'
import ops from 'rxjs/operators/index.js'
import { fromSignal } from './util/signal-observable.js'
import { groupCollections } from './util/array.js'
import { ClassCollection } from './class-collection.js'

const getUpdateObservables = blockInstances => {
  /**
   * Instance = class BuildingBlock {}
   * Category = Instance[]
   * IntervalCategoryInstances = { [number: interval]: Category[] }
   */
  const intervalCategoryInstances = blockInstances
    .map(instance => new ClassCollection(instance.interval, [instance]))
    .reduce(groupCollections, [])
    .map(intervalCollection =>
      intervalCollection
        .map(instance => new ClassCollection(instance.constructor, [instance]))
        .reduce(
          groupCollections,
          new ClassCollection(intervalCollection.static)
        )
    )

  const baseUpdateObservable = rxjs.timer(0, 1000)

  return intervalCategoryInstances.map(interval =>
    baseUpdateObservable.pipe(
      ops.filter((_, i) => i % interval.static === 0),
      ops.flatMap(() => interval),
      ops.tap(async category => {
        const staticUpdateVal = await category.static.update()
        for (let i = 0; i < category.length; i++) {
          category[i].callUpdate(staticUpdateVal)
        }
      }),
      ops.skipWhile(() => true)
    )
  )
}

const getSignalObservables = blockInstances => {
  const signalCollections = blockInstances
    .filter(instance => instance.update_on_signal)
    .map(instance => new ClassCollection(instance.update_on_signal, [instance]))
    .reduce(groupCollections, [])

  return signalCollections.map(collection =>
    fromSignal(collection.static).pipe(
      ops.flatMap(() =>
        Promise.all(collection.map(instance => instance.callUpdate()))
      )
    )
  )
}

// main observable function
export const getStatusObservable = (config, blocksMap) => {
  const renderIntervalObservable = rxjs.timer(0, config.interval * 1000)

  const blockInstances = config.block.map(blockConfig => {
    const blockClass = blocksMap[blockConfig.block]
    return new blockClass(config, blockConfig)
  })
  const updateObservables = getUpdateObservables(blockInstances)

  const signalObservables = getSignalObservables(blockInstances)

  const renderObservable = rxjs.merge(
    renderIntervalObservable,
    ...signalObservables
  ).pipe(
    ops.map(() =>
      blockInstances.reduce((acc, instance) => {
        const rendered = instance.callRender()
        return acc.concat(rendered)
      }, [])
    ),
    ops.map(JSON.stringify),
    ops.map(jsonStr => ',' + jsonStr)
  )

  const updateRenderObservable = rxjs.merge(...updateObservables, renderObservable)

  return rxjs.merge(...updateObservables, renderObservable)
  return new rxjs.Observable(destination => {
    updateRenderObservable.subscribe(destination)
  })
}
