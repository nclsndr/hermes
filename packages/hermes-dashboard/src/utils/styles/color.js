import { colors } from './vars'

const color = (selector, value = 'base', opacity=1) => {
  if (opacity === 1) return colors[selector][value]
  const hex = colors[selector][value]
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export default color
