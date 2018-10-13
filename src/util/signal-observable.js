import { Observable } from 'rxjs'

export default signal =>
  new Observable(destination => {
    process.on(signal, () => destination.next())
  })
