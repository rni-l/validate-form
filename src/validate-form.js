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
  // 表单数据
  this.rules = rules
  this.outputType = opts.outputType || 'normal'
  // 是否有错误
  this.isHaveError = false
  // 输出的错误信息
  this.errorTxt = ''
  this.errorTxtArray = []
}

ValidateForm.prototype = {
  validate(values, isMulitple) {
    const outputType = isMulitple || this.outputType

    // 是否跳出
    let isBreak = false
    const isNormal = outputType === 'normal'
    this.errorTxt = ''
    this.errorTxtArray = []
    Object.keys(values).some(key => {
      const item = this.rules[key]
      const value = values[key]
      let errorTxt = this.$getEmptyErrorPrompt(key)
      // 没有当前对象的 rule，跳出
      if (!item) return false
      // 没有验证规则，直接判断是否为空
      if (item.length <= 0) {
        if (this.$checkIsEmpty(value)) {
          isBreak = true
          this.$addErrorTxt(errorTxt, isNormal)
        }
      } else {
        // 循环规则
        item.some(rule => {
          const isEmpty = this.$checkIsEmpty(value)
          const { error, require, type, func, min, max } = rule
          let isContinue = true
          errorTxt = error || errorTxt
          // 必填 || 值不为空
          // 必填或者值不为空的，就需要校验
          if (require || !isEmpty) {
            const _type = this.$getType(type)
            // 判断是否基本类型
            if (_type) {
              if (this.$checkIsBaseType(_type)) {
                let isFail = false
                if (!this.$validateDataOfBaseType(_type, value)) {
                  isFail = true
                }
                if ((_type === 'string' || _type === 'number') && (min || max)) {
                  if (_type === 'string') {
                    // 判断长度
                    const len = value.length
                    if (min && max) {
                      if (len < min || len > max) isFail = true
                    } else if (min) {
                      if (len < min) isFail = true
                    } else if (max) {
                      if (len > max) isFail = true
                    }
                  } else if (_type === 'number') {
                    // 判断大小
                    if (min && max) {
                      if (value < min || value > max) isFail = true
                    } else if (min) {
                      if (value < min) isFail = true
                    } else if (max) {
                      if (value > max) isFail = true
                    }
                  }
                }
                if (isFail) {
                  isBreak = true
                  isContinue = false
                  this.$addErrorTxt(errorTxt, isNormal)
                }
              }
              // 指定的验证方法
            } else if (func) {
              const error = func(value)
              if (error) {
                isBreak = true
                isContinue = false
                this.$addErrorTxt(error || errorTxt, isNormal)
              }
              // 判空
            } else if (isEmpty) {
              isBreak = true
              isContinue = false
              this.$addErrorTxt(errorTxt, isNormal)
            }
          }
          return !isContinue
        })
      }
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

  // null undefine false ''
  $checkIsEmpty(value) {
    return (!!(!value && value !== 0))
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

  setRules(rules) {
    this.rules = rules
  }
}

export default ValidateForm
