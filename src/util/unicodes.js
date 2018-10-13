export const degree = '°'
export const lightningBolt = '⚡' // console.log('\u{26A1}')
export const upload = '↑'
export const download = '↓'
export const moonPhases = [
  { char: '🌑', time: 184566, phase: 'new' },
  { char: '🌒', time: 553699, phase: 'waxingCrescent' },
  { char: '🌓', time: 922831, phase: 'firstQuarter' }, //
  { char: '🌔', time: 1291963, phase: 'waxingGibbous' }, // waxingGibbous
  { char: '🌕', time: 1661096, phase: 'full' }, // full
  { char: '🌖', time: 2030228, phase: 'waningGibbous' }, // waningGibbous
  { char: '🌗', time: 2399361, phase: 'thirdQuarter' }, // thirdQuarter
  { char: '🌘', time: 2768493, phase: 'waningCrescent' } // waningCrescent
  // { char: '🌑', time: 184566, phase: 'new' },
  // { char: '🌒', time: 553699, phase: 'waxingCrescent' },
  // { char: '🌓', time: 922831, phase: 'firstQuarter' },
  // { char: '🌔', time: 1291963, phase: 'waxingGibbous'},
  // { char: '🌕', time: 1661096, phase: 'full' },
  // { char: '🌖', time: 2030228, phase: 'waningGibbous' },
  // { char: '🌗', time: 2399361, phase: 'thirdQuarter' },
  // { char: '🌘', time: 2768493, phase: 'waningCrescent' }
]
export const capacity = percent =>
  ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'].find(
    (char, i, { length }) => percent / 100 <= (i + 1) / length
  )
