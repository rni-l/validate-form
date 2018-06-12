import ValidateForm from './../../src/validate-form'

describe('validate-form', () => {
  let Form = {}
  beforeEach(() => {
    Form = new ValidateForm()
  })

  describe('base', () => {
    it('Verify that the object have some properties', () => {
      const { formObj, outputType, isHaveError, errorTxt, errorTxtArray, baseType, baseTypeFunc } = Form
      expect(formObj).to.be.an('object')
      expect(outputType).to.be.a('string')
      expect(isHaveError).to.be.a('boolean')
      expect(errorTxt).to.be.a('string')
      expect(errorTxtArray).to.be.an('array')
      expect(baseType.join('')).to.equal(['string', 'number', 'boolean', 'object', 'array', 'function'].join(''))
      expect(baseTypeFunc).to.be.an('object')
    })

    it('In initialization, formatting a validate-form object through the form value and options', () => {
      const formValue = {
        a: 123,
        b: '234',
        c: []
      }
      const options = {
        a: [],
        b: [],
        c: []
      }
      const data = Form.$formatFromValueAndOptions(formValue, options)
      expect(data.a).to.be.an('object')
      expect(data.a.value).to.equal(123)
      expect(data.a.validates).to.be.an('array')
      expect(data.b).to.be.an('object')
      expect(data.b.value).to.equal('234')
      expect(data.b.validates).to.be.an('array')
      expect(data.c).to.be.an('object')
      expect(data.c.value).to.be.an('array')
      expect(data.c.validates).to.be.an('array')
    })

    it('In initialization, formatting a validate-form object through from the form obj', () => {
      const { form } = Form.$initParams({
        a: {
          validate: [], value: 123
        },
        b: {
          validate: [], value: '234'
        },
        c: {
          validate: [], value: []
        }
      })
      expect(form.a).to.be.an('object')
      expect(form.a.value).to.equal(123)
      expect(form.a.validate).to.be.an('array')
      expect(form.b).to.be.an('object')
      expect(form.b.value).to.equal('234')
      expect(form.b.validate).to.be.an('array')
      expect(form.c).to.be.an('object')
      expect(form.c.value).to.be.an('array')
      expect(form.c.validate).to.be.an('array')
    })

    it('In the output, configuration outputType to "normal" , if have an error, it will break out and output to the first error message', () => {
      const data = Form.validate({
        a: {
          validates: [
            { required: true, message: '请输入 a 的值' }
          ],
          value: ''
        },
        b: {
          validates: [
            { required: true, message: '请输入 b 的值' }
          ],
          value: ''
        }
      })
      expect(data).to.equal('请输入 a 的值')
    })

    it('In the output, configuration outputType to "all", if have an error, it will break out and output the all error messages', () => {
      const data = Form.validate({
        a: {
          validates: [
            { required: true, message: '请输入 a 的值' }
          ],
          value: ''
        },
        b: {
          validates: [
            { required: true, message: '请输入 b 的值' }
          ],
          value: ''
        }
      }, { outputType: 'array' })
      expect(data).to.be.an('array')
      expect(data[0]).to.equal('请输入 a 的值')
      expect(data[1]).to.equal('请输入 b 的值')
    })
  })

  describe('Validate base type', () => {
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

  describe('validate rule', () => {
    let testObj = {}

    beforeEach(() => {
      testObj = {
        a: {
          validates: [],
          value: ''
        }
      }
    })

    it('Validate the values is false, null or undefined', () => {
      expect(Form.$checkIsEmpty(false)).to.be.true
      expect(Form.$checkIsEmpty(null)).to.be.true
      expect(Form.$checkIsEmpty(undefined)).to.be.true
      expect(Form.$checkIsEmpty('')).to.be.true
    })

    describe('the validates length is empty', () => {
      it('If the value is empty,it will output ${key} 不能为空', () => {
        const data = Form.validate(testObj)
        expect(data).to.equal('a 不能为空')
      })

      it('If the value is exits,it will output false', () => {
        testObj.a.value = '1'
        const data = Form.validate(testObj)
        expect(data).to.be.not.ok
      })
    })

    describe('The validates length is more than 0', () => {
      beforeEach(() => {
        testObj = {
          a: {
            validates: [
              { required: true, message: '请输入 a 的值' }
            ],
            value: ''
          }
        }
      })

      it('The value is exits and the required is true, it will output the first validate message', () => {
        const data = Form.validate(testObj)
        expect(data).to.equal(testObj.a.validates[0].message)
      })

      it('The value is exits and the required is false, it will output the next validate message', () => {
        testObj.a.validates = [
          { required: false, message: '请输入 a 的值' },
          { required: true, message: '请输入 a 的值1' }
        ]
        const data = Form.validate(testObj)
        expect(data).to.equal(testObj.a.validates[1].message)
      })
      
      it('The value type is in baseType, it will auto validate the value', () => {
        expect(Form.validate(testObj)).to.be.ok
        testObj.a.validates[0].type = 'string'
        expect(Form.validate(testObj)).to.be.ok
        testObj.a.value = '1234'
        expect(Form.validate(testObj)).to.be.not.ok
        testObj.a.validates[0].type = 'number'
        expect(Form.validate(testObj)).to.be.ok
        testObj.a.value = 1234
        expect(Form.validate(testObj)).to.be.not.ok
        testObj.a.validates[0].type = 'boolean'
        expect(Form.validate(testObj)).to.be.ok
        testObj.a.value = false
        expect(Form.validate(testObj)).to.be.not.ok
        testObj.a.validates[0].type = 'array'
        expect(Form.validate(testObj)).to.be.ok
        testObj.a.value = []
        expect(Form.validate(testObj)).to.be.not.ok
        testObj.a.validates[0].type = 'object'
        expect(Form.validate(testObj)).to.be.ok
        testObj.a.value = {}
        expect(Form.validate(testObj)).to.be.not.ok
      })

      describe('The value type is function', () => {
        it('The validateFunc is empty, it will validate the value is empty', () => {
          testObj.a.validates[0].type = 'function'
          expect(Form.validate(testObj)).to.be.ok
        })

        it('The validateFunc is exits, it will validate the value from func', () => {
          testObj.a.validates[0].type = 'function'
          testObj.a.validates[0].func = (value) => {
            return value === '123'
          }
          expect(Form.validate(testObj)).to.be.ok
          testObj.a.value = '123'
          expect(Form.validate(testObj)).to.be.not.ok
        })
      })
    })
  })

  // 这里还没想好要怎么弄...
  describe('Verify complex value', () => {
    let test = {}
    beforeEach(() => {
      test = {
        a: {
          validates: [],
          value: 1
        },
        b: {
          validates: [
            { required: true, message: '请输入 b 值' },
            { required: true, message: '请输入数字 b', type: 'number' }
          ],
          value: 1
        },
        c: {
          validates: [
            { required: true, message: '请输入 c 值', type: 'array' }
          ],
          value: []
        },
        d: {
          validates: [
            { required: true, message: '请输入 d 值为 123', type: 'funciton', func: (v) => {
              return v === '123'
            }}
          ],
          value: ''
        }
      }
    })

    it('test-one', () => {
      test.a.value = ''
      expect(Form.validate(test)).to.equal('a 不能为空')
    })
    
    it('test-two', () => {
      test.b.value = '1'
      expect(Form.validate(test)).to.equal(test.b.validates[1].message)
    })

    it('test-three', () => {
      test.c.value = ''
      expect(Form.validate(test)).to.equal(test.c.validates[0].message)
    })

    it('test-four', () => {
      expect(Form.validate(test)).to.equal(test.d.validates[0].message)
    })

    it('test-five', () => {
      test.d.value = '123'
      expect(Form.validate(test)).to.be.not.ok
    })
  })
})
