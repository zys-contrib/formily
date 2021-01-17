import { createForm } from '../'
import { attach, sleep } from './shared'

test('create field', () => {
  const form = attach(createForm())
  const field = attach(
    form.createField({
      name: 'normal',
    })
  )
  expect(field).not.toBeUndefined()
})

test('create field props', () => {
  const form = attach(createForm())
  const field1 = attach(
    form.createField({
      name: 'field1',
      title: 'Field 1',
      description: 'This is Field 1',
      required: true,
    })
  )
  expect(field1.title).toEqual('Field 1')
  expect(field1.description).toEqual('This is Field 1')
  expect(field1.required).toBeTruthy()
  expect(field1.validator).not.toBeUndefined()
  const field2 = attach(
    form.createField({
      name: 'field2',
      disabled: true,
      hidden: true,
    })
  )
  expect(field2.pattern).toEqual('disabled')
  expect(field2.disabled).toBeTruthy()
  expect(field2.display).toEqual('hidden')
  expect(field2.hidden).toBeTruthy()
  const field3 = attach(
    form.createField({
      name: 'field3',
      readOnly: true,
      visible: false,
    })
  )
  expect(field3.pattern).toEqual('readOnly')
  expect(field3.readOnly).toBeTruthy()
  expect(field3.display).toEqual('none')
  expect(field3.visible).toBeFalsy()
  const field4 = attach(
    form.createField({
      name: 'field4',
      value: 123,
    })
  )
  expect(field4.value).toEqual(123)
  expect(field4.initialValue).toBeUndefined()
  const field5 = attach(
    form.createField({
      name: 'field5',
      initialValue: 123,
    })
  )
  expect(field5.value).toEqual(123)
  expect(field5.initialValue).toEqual(123)
})

test('nested display/pattern', () => {
  const form = attach(createForm())
  const object_ = attach(
    form.createObjectField({
      name: 'object',
    })
  )
  const void_ = attach(
    form.createVoidField({
      name: 'void',
      basePath: 'object',
    })
  )
  const aaa = attach(
    form.createField({
      name: 'aaa',
      basePath: 'object.void',
    })
  )
  const bbb = attach(
    form.createField({
      name: 'bbb',
      basePath: 'object',
    })
  )
  object_.setPattern('readPretty')
  expect(void_.pattern).toEqual('readPretty')
  expect(aaa.pattern).toEqual('readPretty')
  expect(bbb.pattern).toEqual('readPretty')
  object_.setPattern('readOnly')
  expect(void_.pattern).toEqual('readOnly')
  expect(aaa.pattern).toEqual('readOnly')
  expect(bbb.pattern).toEqual('readOnly')
  object_.setPattern('disabled')
  expect(void_.pattern).toEqual('disabled')
  expect(aaa.pattern).toEqual('disabled')
  expect(bbb.pattern).toEqual('disabled')
  object_.setPattern()
  expect(void_.pattern).toEqual('editable')
  expect(aaa.pattern).toEqual('editable')
  expect(bbb.pattern).toEqual('editable')

  object_.setDisplay('hidden')
  expect(void_.display).toEqual('hidden')
  expect(aaa.display).toEqual('hidden')
  expect(bbb.display).toEqual('hidden')
  object_.setDisplay('none')
  expect(void_.display).toEqual('none')
  expect(aaa.display).toEqual('none')
  expect(bbb.display).toEqual('none')
  object_.setDisplay()
  expect(void_.display).toEqual('visible')
  expect(aaa.display).toEqual('visible')
  expect(bbb.display).toEqual('visible')

  aaa.setValue('123')
  expect(aaa.value).toEqual('123')
  aaa.setDisplay('none')
  expect(aaa.value).toBeUndefined()
  aaa.setDisplay('visible')
  expect(aaa.value).toEqual('123')
  aaa.setValue('123')
  object_.setDisplay('none')
  expect(aaa.value).toBeUndefined()
  object_.setDisplay('visible')
  expect(aaa.value).toEqual('123')
})

test('setValue/setInitialValue', () => {
  const form = attach(createForm())
  const aaa = attach(
    form.createField({
      name: 'aaa',
    })
  )
  const bbb = attach(
    form.createField({
      name: 'bbb',
    })
  )
  aaa.setValue('123')
  expect(aaa.value).toEqual('123')
  expect(form.values.aaa).toEqual('123')
  bbb.setValue('123')
  expect(bbb.value).toEqual('123')
  expect(form.values.bbb).toEqual('123')
  const ccc = attach(
    form.createField({
      name: 'ccc',
    })
  )
  const ddd = attach(
    form.createField({
      name: 'ddd',
    })
  )
  ccc.setInitialValue('123')
  expect(ccc.value).toEqual('123')
  expect(ccc.initialValue).toEqual('123')
  expect(form.values.ccc).toEqual('123')
  ddd.setInitialValue('123')
  expect(ddd.value).toEqual('123')
  expect(ddd.initialValue).toEqual('123')
  expect(form.values.ddd).toEqual('123')
  ccc.setInitialValue('222')
  expect(ccc.value).toEqual('222')
  expect(ccc.initialValue).toEqual('222')
  expect(form.values.ccc).toEqual('222')
  ddd.setInitialValue('222')
  expect(ddd.value).toEqual('222')
  expect(ddd.initialValue).toEqual('222')
  expect(form.values.ddd).toEqual('222')
})

test('setLoading/setValidating', async () => {
  const form = attach(createForm())
  const field = attach(
    form.createField({
      name: 'aa',
    })
  )
  field.setLoading(true)
  expect(field.loading).toBeFalsy()
  await sleep()
  expect(field.loading).toBeTruthy()
  field.setLoading(false)
  expect(field.loading).toBeFalsy()
  field.setValidating(true)
  expect(field.validating).toBeFalsy()
  await sleep()
  expect(field.validating).toBeTruthy()
  field.setValidating(false)
  expect(field.validating).toBeFalsy()
})

test('setComponent/setComponentProps', () => {
  const form = attach(createForm())
  const field = attach(
    form.createField({
      name: 'aa',
    })
  )
  const component = () => null
  field.setComponent(component, { props: 123 })
  expect(field.component[0]).toEqual(component)
  expect(field.component[1]).toEqual({ props: 123 })
  field.setComponentProps({
    hello: 'world',
  })
  expect(field.component[1]).toEqual({ props: 123, hello: 'world' })
})

test('setDecorator/setDecoratorProps', () => {
  const form = attach(createForm())
  const field = attach(
    form.createField({
      name: 'aa',
    })
  )
  const component = () => null
  field.setDecorator(component, { props: 123 })
  expect(field.decorator[0]).toEqual(component)
  expect(field.decorator[1]).toEqual({ props: 123 })
  field.setDecoratorProps({
    hello: 'world',
  })
  expect(field.decorator[1]).toEqual({ props: 123, hello: 'world' })
})

test('validate/errors/warnings/successes/valid/invalid/validateStatus/queryFeedbacks', async () => {
  const form = attach(createForm())
  const field = attach(
    form.createField({
      name: 'aa',
      required: true,
      validateFirst: true,
      validator: [
        (value) => {
          if (value == '123') {
            return {
              type: 'success',
              message: 'success',
            }
          } else if (value == '321') {
            return {
              type: 'warning',
              message: 'warning',
            }
          } else if (value == '111') {
            return 'error'
          }
        },
        {
          triggerType: 'onBlur',
          format: 'url',
        },
      ],
    })
  )
  const field2 = attach(
    form.createField({
      name: 'bb',
      required: true,
      value: '111',
      validator: [
        (value) => {
          if (value == '123') {
            return {
              type: 'success',
              message: 'success',
            }
          } else if (value == '321') {
            return {
              type: 'warning',
              message: 'warning',
            }
          } else if (value == '111') {
            return 'error'
          }
        },
        {
          triggerType: 'onBlur',
          format: 'url',
        },
      ],
    })
  )
  await field.validate()
  await field2.validate()
  expect(field.invalid).toBeTruthy()
  expect(field.errors.length).toEqual(1)
  expect(field2.invalid).toBeTruthy()
  expect(field2.errors.length).toEqual(2)
  await field.onInput('123')
  expect(field.successes).toEqual(['success'])
  await field.onInput('321')
  expect(field.warnings).toEqual(['warning'])
  await field.onInput('111')
  expect(field.errors).toEqual(['error'])
  await field.onBlur()
  expect(field.errors).toEqual(['This field is a invalid url', 'error'])
})

test('query', () => {
  const form = attach(createForm())
  const object_ = attach(
    form.createObjectField({
      name: 'object',
    })
  )
  const void_ = attach(
    form.createVoidField({
      name: 'void',
      basePath: 'object',
    })
  )
  const aaa = attach(
    form.createField({
      name: 'aaa',
      basePath: 'object.void',
    })
  )
  const bbb = attach(
    form.createField({
      name: 'bbb',
      basePath: 'object',
    })
  )
  expect(object_.query('object.void').void.get()).not.toBeUndefined()
  expect(object_.query('object.void.aaa').get()).not.toBeUndefined()
  expect(void_.query('.')).not.toBeUndefined()
  expect(void_.query('.bbb').get()).not.toBeUndefined()
  expect(aaa.query('.ccc').get()).toBeUndefined()
  expect(aaa.query('..').get()).not.toBeUndefined()
  expect(aaa.query('..bbb').get()).not.toBeUndefined()
  expect(bbb.query('.void').void.get()).not.toBeUndefined()
  expect(bbb.query('.void.aaa').get()).not.toBeUndefined()
  expect(bbb.query('.void.ccc').get()).toBeUndefined()
})

test('reset', async () => {
  const form = attach(
    createForm({
      values: {
        bb: 123,
      },
      initialValues: {
        aa: 123,
      },
    })
  )
  const aa = attach(
    form.createField({
      name: 'aa',
      required: true,
    })
  )
  const bb = attach(
    form.createField({
      name: 'bb',
      required: true,
    })
  )
  expect(aa.value).toEqual(123)
  expect(bb.value).toEqual(123)
  expect(form.values.aa).toEqual(123)
  expect(form.values.bb).toEqual(123)
  aa.onInput('xxxxx')
  expect(form.values.aa).toEqual('xxxxx')
  aa.reset()
  expect(aa.value).toEqual(123)
  expect(form.values.aa).toEqual(123)
  bb.onInput('xxxxx')
  expect(form.values.bb).toEqual('xxxxx')
  bb.reset()
  expect(bb.value).toBeUndefined()
  expect(form.values.bb).toBeUndefined()
  aa.reset({
    forceClear: true,
  })
  expect(aa.value).toBeUndefined()
  expect(form.values.aa).toBeUndefined()
  expect(aa.valid).toBeTruthy()
  await aa.reset({
    forceClear: true,
    validate: true,
  })
  expect(aa.valid).toBeFalsy()
})

test('match', () => {
  const form = attach(
    createForm({
      values: {
        bb: 123,
      },
      initialValues: {
        aa: 123,
      },
    })
  )
  const aa = attach(
    form.createField({
      name: 'aa',
      required: true,
    })
  )
  expect(aa.match('aa')).toBeTruthy()
  expect(aa.match('*')).toBeTruthy()
  expect(aa.match('a~')).toBeTruthy()
  expect(aa.match('*(aa,bb)')).toBeTruthy()
})

test('setState/getState', () => {})

test('setDataSource', () => {})

test('setTitle/setDescription', () => {})

test('setFeedback', () => {})

test('setErrors/setWarnings/setSuccesses', () => {})

test('setValidator', () => {})

test('reactions props', () => {})

test('dispose reactions', () => {})
