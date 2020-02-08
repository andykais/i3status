import rxjs from 'rxjs'

export const fromSignal = signal =>
  new rxjs.Observable(destination => {
    process.on(signal, () => destination.next())
  })
