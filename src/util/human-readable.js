export const humanSizes = (bytes, { sigfig = 2, unitsFunc } = {}) => {
  const { readable, magnitude } =
    bytes > 1e9
      ? { readable: bytes / 1e9, magnitude: 'G' }
      : bytes > 1e6
        ? { readable: bytes / 1e6, magnitude: 'M' }
        : { readable: bytes / 1e3, magnitude: 'K' }
  return `${readable.toFixed(sigfig)}${
    unitsFunc ? unitsFunc(magnitude) : magnitude
  }`
}
