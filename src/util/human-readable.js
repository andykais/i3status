const units = ['B', 'K', 'M', 'G', 'T', 'P']

export const humanSizes = (bytes, { sigfig = 3 } = {}) => {
  let i = 0
  while (bytes > 1000 && i < units.length) {
    bytes /= 1024
    i++
  }
  const rounded =
    bytes > Math.pow(10, sigfig - 1)
      ? bytes.toFixed(0)
      : bytes.toPrecision(sigfig)
  return `${rounded}${units[i]}`
}
