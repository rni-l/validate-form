import ValidateForm from './validate-form'

const form = new ValidateForm()
console.log(form)
console.log(
  form.validate({
    a: {
      validates: [
        { required: true, message: '请输入 a 的值', type: 'string' }
      ],
      value: '1234'
    }
  })
)
