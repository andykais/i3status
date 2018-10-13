import { Observable, Subject, timer, merge, of } from 'rxjs'
import { flatMap, map, filter, tap, skipWhile } from 'rxjs/operators'
import fromSignal from './util/signal-observable'

export default (blocks, config) => {
  const renderIntervalObservable = timer(0, 1000)
  const renderIntervalSubject = new Subject()

  const blockInstances = config.block.map(
    b => new (blocks.find(blockClass => blockClass.name === b.block))(config, b)
  )

  const updateObservables = blockInstances.map(instance =>
    renderIntervalSubject.pipe(
      filter((_, i) => i % instance.interval === 0),
      tap(instance.callUpdate),
      skipWhile(() => true)
    )
  )

  const signalObservables = ['SIGUSR1', 'SIGUSR2'].map(signal =>
    fromSignal(signal).pipe(
      flatMap(() =>
        Promise.all(
          blockInstances
            .filter(instance => instance.update_on_signal)
            .map(instance => instance.callUpdate())
        )
      )
    )
  )

  const renderObservable = merge(
    renderIntervalSubject,
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

  return new Observable(destination => {
    // subscribe to subjects for blocks
    // fromSignal('SIGUSR1').subscribe(renderTriggers.SIGUSR1)
    // fromSignal('SIGUSR2').subscribe(renderTriggers.SIGUSR2)
    renderIntervalObservable.subscribe(renderIntervalSubject)
    // start the main observable
    updateRenderObservable.subscribe(destination)
  })
}
