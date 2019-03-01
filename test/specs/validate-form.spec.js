import ValidateForm from './../../src/validate-form'

const baseTypeList = {
  string: [
    { type: 'isString', value: '123', expect: 'true' },
    { type: 'isString', value: null, expect: 'false' },
    { type: 'isString', value: [], expect: 'false' },
    { type: 'isString', value: {}, expect: 'false' },
    { type: 'isString', value: '', expect: 'false' },
    { type: 'isString', value: 123, expect: 'false' },
    { type: 'isArray', value: 'undefined', expect: 'false' }
  ],
  boolean: [
    { type: 'isBoolean', value: true, expect: 'true' },
    { type: 'isBoolean', value: false, expect: 'true' },
    { type: 'isBoolean', value: '123', expect: 'false' },
    { type: 'isBoolean', value: null, expect: 'false' },
    { type: 'isBoolean', value: [], expect: 'false' },
    { type: 'isBoolean', value: {}, expect: 'false' },
    { type: 'isBoolean', value: '', expect: 'false' },
    { type: 'isBoolean', value: 123, expect: 'false' },
    { type: 'isBoolean', value: 'undefined', expect: 'false' }
  ],
  number: [
    { type: 'isNumber', value: '123', expect: 'false' },
    { type: 'isNumber', value: '123n', expect: 'false' },
    { type: 'isNumber', value: null, expect: 'false' },
    { type: 'isNumber', value: [], expect: 'false' },
    { type: 'isNumber', value: {}, expect: 'false' },
    { type: 'isNumber', value: '', expect: 'false' },
    { type: 'isNumber', value: 123, expect: 'true' },
    { type: 'isNumber', value: 0, expect: 'true' },
    { type: 'isNumber', value: -1, expect: 'true' },
    { type: 'isNumber', value: 'undefined', expect: 'false' }
  ],
  array: [
    { type: 'isArray', value: '123', expect: 'false' },
    { type: 'isArray', value: null, expect: 'false' },
    { type: 'isArray', value: [], expect: 'true' },
    { type: 'isArray', value: {}, expect: 'false' },
    { type: 'isArray', value: '', expect: 'false' },
    { type: 'isArray', value: 123, expect: 'false' },
    { type: 'isArray', value: 'undefined', expect: 'false' }
  ],
  object: [
    { type: 'isObject', value: '123', expect: 'false' },
    { type: 'isObject', value: null, expect: 'false' },
    { type: 'isObject', value: [], expect: 'false' },
    { type: 'isObject', value: {}, expect: 'true' },
    { type: 'isObject', value: '', expect: 'false' },
    { type: 'isObject', value: 123, expect: 'false' },
    { type: 'isObject', value: 'undefined', expect: 'false' }
  ],
  function: [
    { type: 'isFunction', value: () => {}, expect: 'true' },
    { type: 'isFunction', value: '123', expect: 'false' },
    { type: 'isFunction', value: null, expect: 'false' },
    { type: 'isFunction', value: [], expect: 'false' },
    { type: 'isFunction', value: {}, expect: 'false' },
    { type: 'isFunction', value: '', expect: 'false' },
    { type: 'isFunction', value: 123, expect: 'false' },
    { type: 'isFunction', value: 'undefined', expect: 'false' }
  ]
}

function validateBase(data, validate, isStatic) {
  function changeType(type) {
    return !isStatic ? type : type.slice(2).toLowerCase()
  }
  data.forEach(rule => {
    expect(validate(changeType(rule.type), rule.value)).to.be[rule.expect]
  })
}

function checkString(validate, isStatic) {
  validateBase(baseTypeList.string, validate, isStatic)
}

function checkBoolean(validate, isStatic) {
  validateBase(baseTypeList.boolean, validate, isStatic)
}

function checkNumber(validate, isStatic) {
  validateBase(baseTypeList.number, validate, isStatic)
}

function checkArray(validate, isStatic) {
  validateBase(baseTypeList.array, validate, isStatic)
}

function checkObject(validate, isStatic) {
  validateBase(baseTypeList.object, validate, isStatic)
}

function checkFunction(validate, isStatic) {
  validateBase(baseTypeList.function, validate, isStatic)
}

describe('validate-form', () => {
  // let Form = {}
  // beforeEach(() => {
  //   Form = new ValidateForm()
  // })

  describe('base', () => {
    it('check properties', () => {
      const Form = new ValidateForm({})
      const { rules, outputType, errorTxt, errorTxtArray, baseType, baseTypeFunc } = Form
      // expect(values).to.be.an('object')
      expect(rules).to.be.an('object')
      expect(outputType).to.be.a('string')
      expect(errorTxt).to.be.a('string')
      expect(errorTxtArray).to.be.an('array')
      expect(baseType.join('')).to.equal(['string', 'number', 'boolean', 'object', 'array', 'function'].join(''))
      expect(baseTypeFunc).to.be.an('object')
    })

    it('check rules', () => {
      try {
        new ValidateForm()
      } catch (error) {
        expect(error).to.equal('请传入规则')
      }
    })
  })

  describe('validate form', () => {
    let Form = {}
    let rules = {}
    beforeEach(() => {
      rules = {
        name: [{ require: true, type: String, error: '请输入name' }, { require: true, type: String, min: 2, max: 10, error: '请输入 2 - 10 长度的 name' }],
        number: [{ require: true, type: Number, error: '请输入 number' }, { require: true, type: Number, min: 1, max: 10, error: '请输入 1 - 10 的 number' }],
        array: [{ require: true, type: Array, error: '请输入 array' }],
        object: [{ require: true, type: Object, error: '请输入 object' }],
        phone: [
          { require: true, error: '请输入手机号' },
          {
            require: true,
            func: value => {
              if (/1\d{10}/.test(value)) return false
              return '请输入正确的手机号'
            }
          }
        ]
      }
      Form = new ValidateForm(rules)
    })

    describe('validate difference condition', () => {
      let values = {}
      beforeEach(() => {
        values = {
          name: 't1',
          number: 1,
          array: [],
          object: {},
          phone: '15625979634'
        }
      })
      it('success', () => {
        const { isSuccess, errorTxt } = Form.validate(values)
        expect(isSuccess).to.be.true
        expect(errorTxt).to.be.empty
      })
      it('check string', () => {
        values.name = ''
        const { isSuccess, errorTxt } = Form.validate(values)
        expect(isSuccess).to.be.false
        expect(errorTxt).to.equal(rules.name[0].error)
      })
      it('check number', () => {
        values.number = ''
        const res1 = Form.validate(values)
        expect(res1.isSuccess).to.be.false
        expect(res1.errorTxt).to.equal(rules.number[0].error)
        values.number = 1
        const res2 = Form.validate(values)
        expect(res2.isSuccess).to.be.true
        expect(res2.errorTxt).to.be.empty
      })
      it('check array', () => {
        values.array = ''
        const { isSuccess, errorTxt } = Form.validate(values)
        expect(isSuccess).to.be.false
        expect(errorTxt).to.equal(rules.array[0].error)
      })
      it('check object', () => {
        values.object = ''
        const { isSuccess, errorTxt } = Form.validate(values)
        expect(isSuccess).to.be.false
        expect(errorTxt).to.equal(rules.object[0].error)
      })
      it('check exist', () => {
        values.phone = ''
        const { isSuccess, errorTxt } = Form.validate(values)
        expect(isSuccess).to.be.false
        expect(errorTxt).to.equal(rules.phone[0].error)
      })
      describe('check min and max to string', () => {
        it('min error', () => {
          values.name = '1'
          const res1 = Form.validate(values)
          expect(res1.isSuccess).to.be.false
          expect(res1.errorTxt).to.equal(rules.name[1].error)
        })
        it('max error', () => {
          values.name = '12345678901'
          const res2 = Form.validate(values)
          expect(res2.isSuccess).to.be.false
          expect(res2.errorTxt).to.equal(rules.name[1].error)
        })
        it('success', () => {
          values.name = '1234567890'
          const res3 = Form.validate(values)
          expect(res3.isSuccess).to.be.true
          expect(res3.errorTxt).to.be.empty
        })
        it('no min', () => {
          // 测试没有 min
          delete rules.name[1].min
          values.name = '1'
          Form.setRules(rules)
          const res4 = Form.validate(values)
          expect(res4.isSuccess).to.be.true
          expect(res4.errorTxt).to.be.empty
        })
        it('no min and error', () => {
          // 没有 min 且 不符合
          delete rules.name[1].min
          values.name = '12345678901'
          const res4_1 = Form.validate(values)
          expect(res4_1.isSuccess).to.be.false
          expect(res4_1.errorTxt).to.equal(rules.name[1].error)
        })
        it('no max', () => {
          // 测试没有 max
          delete rules.name[1].max
          rules.name[1].min = 2
          values.name = '12345678901234567890'
          Form.setRules(rules)
          const res5 = Form.validate(values)
          expect(res5.isSuccess).to.be.true
          expect(res5.errorTxt).to.be.empty
        })
        it('no max and error', () => {
          // 没有 max 且不符合
          delete rules.name[1].max
          values.name = '1'
          const res5_1 = Form.validate(values)
          expect(res5_1.isSuccess).to.be.false
          expect(res5_1.errorTxt).to.equal(rules.name[1].error)
        })
      })
      describe('check min and max to number', () => {
        it('min error', () => {
          values.number = 0
          const res1 = Form.validate(values)
          expect(res1.isSuccess).to.be.false
          expect(res1.errorTxt).to.equal(rules.number[1].error)
        })
        it('max error', () => {
          values.number = 11
          const res2 = Form.validate(values)
          expect(res2.isSuccess).to.be.false
          expect(res2.errorTxt).to.equal(rules.number[1].error)
        })
        it('success', () => {
          values.number = 10
          const res3 = Form.validate(values)
          expect(res3.isSuccess).to.be.true
          expect(res3.errorTxt).to.to.empty
        })
        it('no min', () => {
          // 测试没有 min
          delete rules.number[1].min
          values.number = 0
          Form.setRules(rules)
          const res4 = Form.validate(values)
          expect(res4.isSuccess).to.be.true
          expect(res4.errorTxt).to.be.empty
        })
        it('no min and error', () => {
          // 没有 min 且 不符合
          delete rules.number[1].min
          values.number = 12345678911
          const res4_1 = Form.validate(values)
          expect(res4_1.isSuccess).to.be.false
          expect(res4_1.errorTxt).to.be.equal(rules.number[1].error)
        })
        it('no max', () => {
          // 测试没有 max
          delete rules.number[1].max
          rules.number[1].min = 2
          values.number = 1234567891234
          Form.setRules(rules)
          const res5 = Form.validate(values)
          expect(res5.isSuccess).to.be.true
          expect(res5.errorTxt).to.be.empty
        })
        it('no max and error', () => {
          // 没有 max 且不符合
          delete rules.number[1].max
          values.number = 0
          const res5_1 = Form.validate(values)
          expect(res5_1.isSuccess).to.be.false
          expect(res5_1.errorTxt).to.equal(rules.number[1].error)
        })
      })
      it('check multiple rules', () => {
        values.phone = '1562597963'
        const res1 = Form.validate(values)
        expect(res1.isSuccess).to.be.false
        expect(res1.errorTxt).to.equal('请输入正确的手机号')
        values.phone = '15625979634'
        const res2 = Form.validate(values)
        expect(res2.isSuccess).to.be.true
        expect(res2.errorTxt).to.be.empty
      })
      it('check multiple error', () => {
        values.name = ''
        values.phone = ''
        const { isSuccess, errorTxt } = Form.validate(values, true)
        expect(isSuccess).to.be.false
        expect(errorTxt).to.be.an('array')
        expect(errorTxt[0]).to.equal(rules.name[0].error)
        expect(errorTxt[1]).to.equal(rules.phone[0].error)
      })

      // it('check static validate function', () => {
      //   const { isSuccess, errorTxt } = ValidateForm.validate(rules, values)
      //   expect(isSuccess).to.be.true
      //   expect(errorTxt).to.be.empty
      // })

      it('can update rules', () => {
        const _rules = rules
        _rules.name[1].min = 3
        Form.setRules(_rules)
        const { isSuccess, errorTxt } = Form.validate(values)
        expect(isSuccess).to.be.false
        expect(errorTxt).to.equal(_rules.name[1].error)
      })

      it('check not required', () => {
        rules.name[1].require = false
        values.name = '1'
        Form.setRules(rules)
        const res1 = Form.validate(values)
        expect(res1.isSuccess).to.be.false
        expect(res1.errorTxt).to.equal(rules.name[1].error)
        rules.name[0].require = false
        values.name = ''
        Form.setRules(rules)
        const res2 = Form.validate(values)
        expect(res2.isSuccess).to.be.true
        expect(res2.errorTxt).to.be.empty
      })

      it('no rule', () => {
        const res1 = Form.validate(values)
        expect(res1.isSuccess).to.be.true
        expect(res1.errorTxt).to.be.empty
        rules.name = []
        values.name = ''
        Form.setRules(rules)
        const res2 = Form.validate(values)
        expect(res2.isSuccess).to.be.true
        expect(res2.errorTxt).to.equal('')
      })
      it('no value, but have rule', () => {
        delete values.name
        const { isSuccess, errorTxt } = Form.validate(values)
        expect(isSuccess).to.be.false
        expect(errorTxt).to.equal(rules.name[0].error)
      })
    })

    describe('validate mode', () => {
      let values = {}
      beforeEach(() => {
        values = {
          name: 't1',
          number: 1
        }
      })
      it('validate portion rules', () => {
        Form.mode = 'portion'
        const firstResult = Form.validate(values)
        expect(firstResult.isSuccess).to.be.true
        expect(firstResult.errorTxt).to.be.empty
        const secondResult = Form.validate(Object.assign({}, values, { number: '' }))
        expect(secondResult.isSuccess).to.be.false
        expect(secondResult.errorTxt).to.equal(rules.number[0].error)
      })

      it('validate all rules', () => {
        const firstResult = Form.validate(values)
        expect(firstResult.isSuccess).to.be.false
        expect(firstResult.errorTxt).to.equal(rules.array[0].error)
        const secondResult = Form.validate({
          name: 't1',
          number: 1,
          array: [],
          object: {},
          phone: '15625979634'
        })
        expect(secondResult.isSuccess).to.be.true
        expect(secondResult.errorTxt).to.be.empty
      })
    })
  })

  describe('Validate base type', () => {
    let Form = {}
    beforeEach(() => {
      Form = new ValidateForm()
    })
    const validate = (type, value) => {
      return Form.baseTypeFunc[type](value)
    }
    const staticValidate = (type, value) => {
      return ValidateForm.validateDataOfBaseType(type, value)
    }
    it('Validate string', () => {
      checkString(validate)
    })
    it('Validate string by static', () => {
      checkString(staticValidate, 'static')
    })
    it('Validate boolean', () => {
      checkBoolean(validate)
    })
    it('Validate boolean by static', () => {
      checkBoolean(staticValidate, 'static')
    })
    it('Validate number', () => {
      checkNumber(validate)
    })
    it('Validate number by static', () => {
      checkNumber(staticValidate, 'static')
    })
    it('Validate array', () => {
      checkArray(validate)
    })
    it('Validate array by static', () => {
      checkArray(staticValidate, 'static')
    })
    it('Validate object', () => {
      checkObject(validate)
    })
    it('Validate object by static', () => {
      checkObject(staticValidate, 'static')
    })
    it('Validate function', () => {
      checkFunction(validate)
    })
    it('Validate function by static', () => {
      checkFunction(staticValidate, 'static')
    })
  })
})
