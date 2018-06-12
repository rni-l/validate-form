export const baseType = [
  'string', 'number', 'boolean', 'object', 'array', 'function'
]

export const baseTypeFunc = {
  'isString': (value) => {
    return Object.prototype.toString.call(value) === '[object String]' && value.length > 0
  },
  'isBoolean': (value) => {
    return Object.prototype.toString.call(value) === '[object Boolean]'
  },
  'isNumber': (value) => { 
    return Object.prototype.toString.call(value) === '[object Number]'
  },
  'isObject': (value) => {
    return Object.prototype.toString.call(value) === '[object Object]'
  },
  'isArray': (value) => {
    return Object.prototype.toString.call(value) === '[object Array]'
  },
  'isFunction': (value) => {
    return Object.prototype.toString.call(value) === '[object Function]'
  }
}
