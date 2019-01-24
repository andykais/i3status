const units = ['B', 'K', 'M', 'G', 'T', 'P']

export const humanSizes = (bytes, { sigfig = 2 } = {}) => {
  let i = 0
  while (bytes > 1000 && i < units.length) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(sigfig)}${units[i]}`
}
