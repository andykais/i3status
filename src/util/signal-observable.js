import { Observable } from 'rxjs'

export const fromSignal = signal =>
  new Observable(destination => {
    process.on(signal, () => destination.next())
  })
