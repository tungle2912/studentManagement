import { Button, Form } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import { student } from '../../../types/student'

const UpdateStudent: React.FC<{ student?: student }> = ({ student }) => {
  const [form] = Form.useForm()

  // Populate the form with student data if available
  React.useEffect(() => {
    if (student) {
      form.setFieldsValue({
        name: student.name,
        email: student.email,
        phone: student.phone,
        enrollNumber: student.enrollNumber,
        dateOfAdmission: student.dateOfAdmission ? dayjs(student.dateOfAdmission) : null,
        avatar: student.avatar
      })
    }
  }, [student, form])

  return (
    <Form
      form={form}
      onFinish={()=>{}}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout='horizontal'
      style={{ maxWidth: 600 }}
    >
      <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
        <Button type='default' onClick={() => form.resetFields()}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  )
}

export default UpdateStudent
