import ValidateForm from './../../src/validate-form'

describe('validate-form', () => {
  // let Form = {}
  // beforeEach(() => {
  //   Form = new ValidateForm()
  // })

  describe('base', () => {
    it('check properties', () => {
      const Form = new ValidateForm({})
      const { values, rules, outputType, isHaveError, errorTxt, errorTxtArray, baseType, baseTypeFunc } = Form
      // expect(values).to.be.an('object')
      expect(rules).to.be.an('object')
      expect(outputType).to.be.a('string')
      expect(isHaveError).to.be.a('boolean')
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
        name: [
          { require: true, type: String, error: '请输入name' },
          { require: true, type: String, min: 2, max: 10, error: '请输入 2 - 10 长度的 name' }
        ],
        number: [
          { require: true, type: Number, error: '请输入 number' },
          { require: true, type: Number, min: 1, max: 10, error: '请输入 1 - 10 的 number' }
        ],
        array: [
          { require: true, type: Array, error: '请输入 array' }
        ],
        object: [
          { require: true, type: Object, error: '请输入 object' }
        ],
        phone: [
          { require: true, error: '请输入手机号' },
          {
            require: true, func: (value) => {
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
          console.log(rules.number[1])
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
        expect(res2.isSuccess).to.be.false
        expect(res2.errorTxt).to.equal('name 不能为空')
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
    it('Validate string', () => {
      expect(validate('isString', '123')).to.be.true
      expect(validate('isString', null)).to.be.false
      expect(validate('isString', [])).to.be.false
      expect(validate('isString', {})).to.be.false
      expect(validate('isString', '')).to.be.false
      expect(validate('isString', 123)).to.be.false
      expect(validate('isArray', undefined)).to.be.false
    })
    it('Validate boolean', () => {
      expect(validate('isBoolean', true)).to.be.true
      expect(validate('isBoolean', false)).to.be.true
      expect(validate('isBoolean', null)).to.be.false
      expect(validate('isBoolean', [])).to.be.false
      expect(validate('isBoolean', {})).to.be.false
      expect(validate('isBoolean', '')).to.be.false
      expect(validate('isBoolean', '123')).to.be.false
      expect(validate('isBoolean', undefined)).to.be.false
    })
    it('Validate number', () => {
      expect(validate('isNumber', 123)).to.be.true
      expect(validate('isNumber', 0)).to.be.true
      expect(validate('isNumber', -1)).to.be.true
      expect(validate('isNumber', '1234n')).to.be.false
      expect(validate('isNumber', null)).to.be.false
      expect(validate('isNumber', '123')).to.be.false
      expect(validate('isNumber', [])).to.be.false
      expect(validate('isNumber', '')).to.be.false
      expect(validate('isNumber', {})).to.be.false
      expect(validate('isNumber', undefined)).to.be.false
    })
    it('Validate array', () => {
      expect(validate('isArray', [])).to.be.true
      expect(validate('isArray', null)).to.be.false
      expect(validate('isArray', '123')).to.be.false
      expect(validate('isArray', {})).to.be.false
      expect(validate('isArray', '')).to.be.false
      expect(validate('isArray', 123)).to.be.false
      expect(validate('isArray', undefined)).to.be.false
    })
    it('Validate object', () => {
      expect(validate('isObject', {})).to.be.true
      expect(validate('isObject', null)).to.be.false
      expect(validate('isObject', '123')).to.be.false
      expect(validate('isObject', [])).to.be.false
      expect(validate('isObject', '')).to.be.false
      expect(validate('isObject', 123)).to.be.false
      expect(validate('isObject', undefined)).to.be.false
    })
    it('Validate function', () => {
      expect(validate('isFunction', () => {})).to.be.true
      expect(validate('isFunction', '1234n')).to.be.false
      expect(validate('isFunction', null)).to.be.false
      expect(validate('isFunction', '123')).to.be.false
      expect(validate('isFunction', [])).to.be.false
      expect(validate('isFunction', '')).to.be.false
      expect(validate('isFunction', {})).to.be.false
      expect(validate('isFunction', undefined)).to.be.false
    })
  })

})
