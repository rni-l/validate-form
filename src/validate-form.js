/**
 * @file 验证表单功能
 */
import { baseType, baseTypeFunc } from './baseType'

const ValidateForm = function(opts = {}) {
  // 类型
  this.baseType = baseType
  this.baseTypeFunc = baseTypeFunc
  // 表单数据
  this.formObj = {}
  this.outputType = opts.outputType || 'normal'
  // 是否有错误
  this.isHaveError = false
  // 输出的错误信息
  this.errorTxt = ''
  this.errorTxtArray = []
}

ValidateForm.prototype = {
  validate(formObject, options, config) {
    if (!formObject) {
      console.warn('请传入需要验证的表单值')
      return false
    }
    const data = this.$initParams(formObject, options, config)
    if (!data) return false
    this.formObj = data.form
    this.outputType = data.config.outputType || 'normal'

    // 是否跳出
    let isBreak = false
    const isNormal = this.outputType === 'normal'
    this.errorTxt = ''
    this.errorTxtArray = []
    Object.keys(this.formObj).some(key => {
      const item = this.formObj[key]
      const value = item.value
      let errorTxt = this.$getEmptyPrompt(key)
      // 没有验证规则，直接判断是否为空
      if (item.validates.length <= 0) {
        if (this.$checkIsEmpty(value)) {
          isBreak = true
          this.$addErrorTxt(errorTxt, isNormal)
        }
      } else {
        item.validates.some(validate => {
          const isEmpty = this.$checkIsEmpty(value)
          errorTxt = validate.message || errorTxt
          // 必填 || 非必填 && 值不为空
          if (validate.required || !isEmpty) {
            if (this.$checkIsBaseType(validate.type)) {
              if (validate.type === 'function' ? (validate.func && !validate.func(value) || isEmpty)
                : !this.$validateDataOfBaseType(validate.type, value)) {
                isBreak = true
                this.$addErrorTxt(errorTxt, isNormal)
              }
            } else if (isEmpty) {
              isBreak = true
              this.$addErrorTxt(errorTxt, isNormal)
            }
          }
        })
      }
      if (!isNormal) return false
      if (isBreak) return true
    })
    return isNormal ? this.errorTxt : this.errorTxtArray
  },

  $formatFromValueAndOptions(formObject, options) {
    const tmp = this.$formatFormValueToObject(formObject)
    Object.keys(options).forEach(option => {
      if (tmp[option]) {
        tmp[option].validates = options[option] || []
      }
    })
    return tmp
  },

  $initParams(formObject, options, config) {
    let data = {
      form: {},
      config: {}
    }
    try {
      // 如果 formObject 不都是 object 类型，就查看 options 值
      if (!this.$valdiateIsAllObject(formObject)) {
        if (options && Array.isArray(this.$getObjectFirstValue(options))) {
          // 合并 formObject 和 options
          data.form = this.$formatFromValueAndOptions(formObject, options)
          data.config = config || {}
        } else {
          // 如果 options 第一个值不是数组，默认为配置项
          data.config = options || {}
          data.form = this.$formatFormValueToObject(formObject)
        }
      } else {
        // 第一个值的 validates 是数组，配置项就取 options
        data.config = options || {}
        data.form = formObject
      }
    } catch (error) {
      console.warn(error)
      return false
    }
    return data
  },

  $getObjectFirstValue(obj) {
    let value = ''
    Object.values(obj).some(v => {
      value = v
      return true
    })
    return value
  },

  $valdiateIsAllObject(object) {
    return Object.values(object).every(v => Object.prototype.toString.call(v) === '[object Object]')
  },

  $formatFormValueToObject(object) {
    const tmp = {}
    Object.entries(object).forEach(v => {
      tmp[v[0]] = {
        value: v[1],
        validates: []
      }
    })
    return tmp
  },

  // null undefine false ''
  $checkIsEmpty(value) {
    return (!!(!value && value !== 0))
  },

  $checkIsBaseType(type) {
    return this.baseType.includes(type)
  },

  $getEmptyPrompt(key) {
    return `${key} 不能为空`
  },

  $validateDataOfBaseType(type, value) {
    let result = ''
    switch (type) {
    case 'string':
      result = baseTypeFunc.isString(value)
      break
    case 'boolean':
      result = baseTypeFunc.isBoolean(value)
      break
    case 'number':
      result = baseTypeFunc.isNumber(value)
      break
    case 'object':
      result = baseTypeFunc.isObject(value)
      break
    case 'array':
      result = baseTypeFunc.isArray(value)
      break
    default:
      result = baseTypeFunc.isFunction(value)
      break
    }
    return result
  },

  $addErrorTxt(errorTxt, isNormal) {
    if (isNormal) {
      this.errorTxt = errorTxt
    } else {
      this.errorTxtArray.push(errorTxt)
    }
  }
}

export default ValidateForm
