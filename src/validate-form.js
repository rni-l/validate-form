/**
 * @file 验证表单功能
 */
import { baseType, baseTypeFunc } from './baseType'

/**
 * @param Object opts 初始化配置
 * @param string opts.outputType 验证结果，输出类型
 */
const ValidateForm = function(rules, opts = {}) {
  // 类型
  this.baseType = baseType
  this.baseTypeFunc = baseTypeFunc
  // 规则
  this.rules = rules
  // 输出类型
  // 不传或者传'normal' 返回单条错误信息，其他返回一个数组，包含所有的错误信息
  this.outputType = opts.outputType || 'normal'
  // 输出的错误信息
  this.errorTxt = ''
  this.errorTxtArray = []
  /**
   * mode: 验证模式
   * all: 根据 rules 全验证
   * portion: 根据 params 进行验证
   */
  this.mode = opts.mode || 'all'
}

ValidateForm.prototype = {
  validate(values, isMulitple) {
    if (!this.$validateDataOfBaseType('object', values)) {
      throw new Error('数据格式不正确')
      return {
        isSuccess: false, errorTxt: '数据格式不正确'
      }
    }

    // 是否跳出
    let isBreak = false
    // 是否正常输出错误信息
    const isNormal = isMulitple ? false : this.outputType === 'normal'
    this.errorTxt = ''
    this.errorTxtArray = []
    const mode = this.mode
    // 循环数据
    Object.keys(this.rules).some(key => {
      const item = this.rules[key]
      const value = values[key]
      // 默认错误信息
      let errorTxt = this.$getEmptyErrorPrompt(key)
      // mode = portion 下，没有当前 value 对象，跳出
      if (this.$isNull(value) && mode === 'portion') return false
      // 没有验证规则，直接判断是否为空
      item.some(rule => {
        const isEmpty = this.$checkIsEmpty(value)
        const { error, require, type, func, min, max } = rule
        let isContinue = true
        errorTxt = error || errorTxt
        // 必填 || 值不为空
        // 必填或者值不为空的，就需要校验
        if (require || !isEmpty) {
          const _type = this.$getType(type)
          // 如果有传 type 值
          if (_type) {
            // 判断是否基本类型
            if (this.$checkIsBaseType(_type)) {
              let isFail = false
              // 使用基本类型校验值
              if (!this.$validateDataOfBaseType(_type, value)) isFail = true
              // 如果上一步校验通过，且当前类型是 string 或 number，判断是否有 min 和 max 值
              if (!isFail && (_type === 'string' || _type === 'number') && (min || max)) {
                // string 类型的，会判断字符串长度
                if (_type === 'string') {
                  const len = value.length
                  isFail = this.$validateStringValue(len, min, max)
                  // number 类型会判断值的大小
                } else if (_type === 'number') {
                  isFail = this.$validateNumberValue(value, min, max)
                }
              }
              if (isFail) {
                isBreak = true
                isContinue = false
                this.$addErrorTxt(errorTxt, isNormal)
              }
            } else {
              // 如果不是基本类型，就 next 了
            }
          } else {
            let error = ''
            // 指定的验证方法
            if (func) error = func(value)
            // 判空
            else if (isEmpty) error = errorTxt
            if (error) {
              isBreak = true
              isContinue = false
              this.$addErrorTxt(error || errorTxt, isNormal)
            }
          }
        }
        return !isContinue
      })
      // 如果是多错误类型的，一直循环下去
      if (!isNormal) return false
      // 如果要跳出，不再循环
      if (isBreak) return true
    })
    const returnValue = isNormal ? (this.errorTxt) : this.errorTxtArray
    return {
      isSuccess: isNormal ? !returnValue : !returnValue.length,
      errorTxt: returnValue
    }
  },

  // null undefined false ''
  $checkIsEmpty(value) {
    return (!!(!value && value !== 0))
  },

  // null or undefined
  $isNull(value) {
    return value === null || value === undefined
  },

  $checkIsBaseType(type) {
    return this.baseType.includes(type)
  },

  $getEmptyErrorPrompt(key) {
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
  },

  // vuejs 里面的方法
  $getType(fn) {
    const match = fn && fn.toString().match(/^\s*function (\w+)/)
    return match ? match[1].toLocaleLowerCase() : ''
  },

  // 校验字符串的 min 和 max
  $validateStringValue(len, min, max) {
    let isFail = false
    if (min && max) {
      if (len < min || len > max) isFail = true
    } else if (min) {
      if (len < min) isFail = true
    } else if (max) {
      if (len > max) isFail = true
    }
    return isFail
  },

  // 校验数字的 min 和 max
  $validateNumberValue(value, min, max) {
    let isFail = false
    if (min && max) {
      if (value < min || value > max) isFail = true
    } else if (min) {
      if (value < min) isFail = true
    } else if (max) {
      if (value > max) isFail = true
    }
    return isFail
  },

  setRules(rules) {
    this.rules = rules
  }
}

export default ValidateForm
