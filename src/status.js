import { Observable, timer, merge } from 'rxjs'
import { flatMap, map, filter, tap, skipWhile } from 'rxjs/operators'
import { fromSignal } from './util/signal-observable'
import { groupCollections } from './util/array'
import { ClassCollection } from './class-collection'

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

  const baseUpdateObservable = timer(0, 1000)

  return intervalCategoryInstances.map(interval =>
    baseUpdateObservable.pipe(
      filter((_, i) => i % interval.static === 0),
      flatMap(() => interval),
      tap(async category => {
        const staticUpdateVal = await category.static.update()
        for (let i = 0; i < category.length; i++) {
          category[i].callUpdate(staticUpdateVal)
        }
      }),
      skipWhile(() => true)
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
      flatMap(() =>
        Promise.all(collection.map(instance => instance.callUpdate()))
      )
    )
  )
}

// main observable function
export const getStatusObservable = (config, blocksMap) => {
  const renderIntervalObservable = timer(0, config.interval * 1000)

  const blockInstances = config.block.map(blockConfig => {
    const blockClass = blocksMap[blockConfig.block]
    return new blockClass(config, blockConfig)
  })
  const updateObservables = getUpdateObservables(blockInstances)

  const signalObservables = getSignalObservables(blockInstances)

  const renderObservable = merge(
    renderIntervalObservable,
    ...signalObservables
  ).pipe(
    map(() =>
      blockInstances.reduce((acc, instance) => {
        const rendered = instance.callRender()
        return acc.concat(rendered)
      }, [])
    ),
    map(JSON.stringify),
    map(jsonStr => ',' + jsonStr)
  )

  const updateRenderObservable = merge(...updateObservables, renderObservable)

  return merge(...updateObservables, renderObservable)
  return new Observable(destination => {
    updateRenderObservable.subscribe(destination)
  })
}
