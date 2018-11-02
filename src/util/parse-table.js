export const parseTable = (
  columnKeys,
  parseFunction = v => v
) => tableString => {
  const tableData = []
  return tableString.split('\n').map(line =>
    line
      .trim()
      .split(/\s+/)
      .reduce((acc, item, i) => {
        if (columnKeys[i]) {
          acc[columnKeys[i]] = parseFunction(item, { col: i })
        }
        return acc
      }, {})
  )
}
