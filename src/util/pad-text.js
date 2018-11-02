export const padText = ({ padStart, padEnd }) => {
  const padFunc =
    padStart && padEnd
      ? v => ` ${v} `
      : padStart
        ? v => ` ${v}`
        : padEnd
          ? v => `${v} `
          : v => v

  return text => (text ? padFunc(text) : '')
}
