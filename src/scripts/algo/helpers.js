const moment = ''

export const formatDate = (value, { locale = 'cs', format = 'L' } = {}) => {
  if (moment.locale() !== locale) moment.locale(locale)
  if (!value) return ''
  const valueMoment = moment(value)
  if (!valueMoment.isValid()) return value
  return valueMoment.format(format)
}

export const truncate = (text, length, clamp) => {
  text = text || ''
  clamp = clamp || '...'
  length = length || 30

  if (text.length <= length) return text

  let tcText = text.slice(0, length - clamp.length)
  let last = tcText.length - 1

  while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1

  last = last || length - clamp.length

  tcText = tcText.slice(0, last)

  return tcText + clamp
}

export const dashIfEmpty = (string) => {
  return string || '-'
}
