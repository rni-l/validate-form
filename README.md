# validate-form

> 一个验证表单的库

## 使用

```javascript
import ValidateForm from './validate-form'

// 生成一个对象
// 并且传入 rules 规则
const obj = new ValidateForm(rules)

// 校验
const { isSuccess, errorTxt } = obj.validate(values)
if (isSuccess) // 成功
  else // errorTxt 会有相对应的错误信息
  
// 可以重新设置 rules
obj.setRules(rules_2)

// rules 相关配置
const rules = rules = {
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

// 校验的值
const values = {
  name: 't1',
  number: 1,
  array: [],
  object: {},
  phone: '15625979634'
}

// 内置了一些基本数据类型的校验
// string boolean number array object function 等
// 返回 true or false
obj.baseTypeFunc.isString('123')
```

