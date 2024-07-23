import { PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Upload } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import Tittle from '../../../common/Tittle'
import InputUpdateStudent from '../../../components/InputUpdateStudent'
import { rules } from '../../../lib/rules'
import { student } from '../../../types/student'
import styles from './style.module.scss'
import { useAddStudentMutation } from '../../../hooks/data/auth.data'
import { UpdateStudentValus } from '../../../constants/enums'
import { format } from 'date-fns'
type Props = {
  student?: student
}
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return format(date, 'dd-MMM-yyyy') // Ví dụ định dạng: '23-Jul-2024'
}
function UpdateStudent(props: Props) {
  const [form] = Form.useForm()
  React.useEffect(() => {
    if (props.student) {
      form.setFieldsValue({
        name: props.student.name,
        email: props.student.email,
        phone: props.student.phone,
        enroll_number: props.student.enroll_number,
        date_of_admission: props.student.date_of_admission ? dayjs(props.student.date_of_admission) : null,
        image: props.student.image
      })
    }
  }, [props.student, form])
  const addStudentMutation = useAddStudentMutation()
  const handleAddStudent = async (values: UpdateStudentValus) => {
    const formData = new FormData()
    formData.append('image', values.image.file.originFileObj)
    formData.append('name', values.name)
    formData.append('email', values.email)
    formData.append('phone', values.phone)
    formData.append('enroll_number', values.enroll_number)
    formData.append('date_of_admission', formatDate(values.date_of_admission))
    console.log(formData.getAll('image'))
    await addStudentMutation.mutateAsync(formData, {
      onSuccess(data) {
        console.log(data)
      },
      onError(error) {
        console.log(error)
      }
    })
  }

  return (
    <div className={styles.updateStudentContainer}>
      <Tittle className={styles.tittleUpdateStudent} text='Add New Student'></Tittle>
      <Form
        form={form}
        onFinish={handleAddStudent}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        requiredMark={false}
        layout='horizontal'
      >
        <InputUpdateStudent name='name' label='Name' placeholder='' rules={rules.name} />
        <InputUpdateStudent name='email' label='Email' rules={rules.email} />
        <InputUpdateStudent name='phone' label='Phone' placeholder='' rules={rules.phone} />
        <InputUpdateStudent name='enroll_number' label='Enroll Number' placeholder='' rules={rules.enroll_number} />
        <Form.Item label='Date Of Admission' name='date_of_admission'>
          <DatePicker size='large' format='YYYY-MM-DD' />
        </Form.Item>
        <Form.Item label='Avatar' name='image'>
          <Upload listType='picture-card'>
            <button style={{ border: 0, background: 'none' }} type='button'>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button htmlType='submit' className={styles.buttonSubmit}>
            Submit
          </Button>
          <Button className={styles.buttonReset} onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UpdateStudent
