import cx from 'classnames'
import capitalize from './capitalize'

export default function suitcx (parent, modifiers, state) {
  return cx([
    parent,
    ...Object.keys(modifiers || {}).reduce((classes, key) => {
      const fullKey = `${parent}--${key}`
      const value = modifiers[key]
      switch (typeof value) {
        case 'boolean':
        case 'number':
          if (value) classes.push(fullKey); break
        case 'string':
          classes.push(`${fullKey}${capitalize(value)}`); break
      }
      return classes
    }, []),
    ...Object.keys(state || {}).reduce((classes, key) => {
      if (state[key]) {
        const fullKey = `is-${key}`
        classes.push(fullKey)
      }
      return classes
    }, [])
  ])
}
