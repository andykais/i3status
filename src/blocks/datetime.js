import BuildingBlock from '../building-block.js'

class DateTime extends BuildingBlock {
  static block = 'DateTime'

  update = () => ({
    date: Date.now()
  })
  render = ({ date }) => [
    {
      name: 'time',
      full_text: new Date(date)
        .toLocaleString('en-us', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
        .replace(/,/g, '')
    }
  ]
}

export { DateTime }
