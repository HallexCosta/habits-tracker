import dayjs from 'dayjs'

export function generateDatesFromBeginning() {
  const firstDayOfTheYear = dayjs().startOf('year')
  console.log(firstDayOfTheYear)
  const today = new Date()

  const dates = []
  let compareDate = firstDayOfTheYear

  while (compareDate.isBefore(today)) {
    dates.push(compareDate.toDate())
    compareDate = compareDate.add(1, 'day')
  }

  return dates
}
