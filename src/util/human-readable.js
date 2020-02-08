const units = ['B', 'K', 'M', 'G', 'T', 'P']

export const humanSizes = (bytes, { sigfig = 3, givenUnit = 'B' } = {}) => {
  let i = units.indexOf(givenUnit)
  if (i === -1) throw new Error(`I cant use the given unit of ${givenUnit}`)

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
