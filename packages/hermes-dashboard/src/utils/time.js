/* ------------------------------------------
   Time helper
--------------------------------------------- */
import moment from 'moment'

// Format a date from a format to another
export const formatDate = (input, format = 'timestamp', inputFormat = null) => {
  if (input) {
    let d
    if (inputFormat === null) {
      d = moment(input)
    } else {
      switch (inputFormat) {
        case 'isoUTC': {
          d = moment(input, "YYYY-MM-DD'T'HH:mm:ss.SSS'Z'")
          break
        }
        case 'momentObj': {
          d = input
          break
        }
        default: {
          d = moment(input, inputFormat)
        }
      }
    }
    switch (format) {
      case 'timestamp': {
        return d.unix()
      }
      case 'unixMs': {
        return d.valueOf()
      }
      case 'isoUTC': {
        return `${d.utc().format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`
      }
      case 'fromNow': {
        return `${d.fromNow(true)}`
      }
      case 'fromNowAgo': {
        return `${d.fromNow()}`
      }
      default: {
        return moment(d).format(format)
      }
    }
  }
  return 0
}

// Output the current date/time to a particular format
export const formatNow = (format = 'timestamp') => {
  return formatDate(moment().valueOf(), format, 'x')
}

// Output a date diff between to date in a particular unit
export const diffDatesAs = (
  input, unit = 'days', precise = false, ref = moment(), inputFormat = 'x'
) => {
  const mInput = moment(input, inputFormat)
  return mInput.diff(ref, unit, precise)
}

// Give back the time from now of a given date
export const timeFrom = input => {
  if (input) {
    return moment(input).fromNow(true)
    // const isToday = moment(input).isSame(moment(), 'day')
    // const lessThan6Days = moment(input).diff(moment(), 'days') < -5
    // return input && moment(input)
    //   .format(isToday ? 'HH:mm' : lessThan6Days ? 'ddd DD.MM HH:mm' : 'ddd HH:mm')
  }
  return moment().fromNow(true)
}

export const nowUTCTimestamp = () => moment().valueOf()
