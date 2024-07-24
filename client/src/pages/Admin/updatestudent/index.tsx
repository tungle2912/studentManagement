/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, message, Upload, UploadFile } from 'antd'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Tittle from '../../../common/Tittle'
import InputUpdateStudent from '../../../components/InputUpdateStudent'
import { UpdateStudentValus } from '../../../constants/enums'
import { useAddStudentMutation } from '../../../hooks/data/students.data'
import { useEditStudentMutation, useGetStudentByIdQuery } from '../../../hooks/data/students.data'
import { rules } from '../../../lib/rules'
import styles from './style.module.scss'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return format(date, 'dd-MMM-yyyy') // Ví dụ định dạng: '23-Jul-2024'
}
function UpdateStudent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isAdd, setIsAdd] = useState(true)
  const [tittile, setTittle] = useState('Add New Student')
  const studentData = useGetStudentByIdQuery({ studentId: id || '', enabled: Boolean(id) })
  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    if (studentData.data) {
      const data = studentData?.data?.data?.result
      setIsAdd(false)
      setTittle('Edit Student')
      console.log('data', data)
      const fileExits = {
        uid: '-1',
        name: 'avatar.png',
        status: 'done',
        url: `http://localhost:4000/admin/students/${data.avatar}`
      } as UploadFile
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
        enroll_number: data.enroll_number,
        date_of_admission: dayjs(data.date_of_admission, 'DD-MMM-YYYY'),
        image: {
          file: fileExits,
          fileList: [fileExits]
        }
      })
      setFileList([fileExits])
    }
  }, [studentData?.data])

  const editStudentMutation = useEditStudentMutation()
  const handleEditStudent = async (values: UpdateStudentValus) => {
    console.log('edit')
    console.log('value', values)
    const formData = new FormData()
    if (values.image.file.originFileObj) {
      formData.append('image', values.image.file.originFileObj)
    }
    console.log('img', values.image.file.originFileObj)
    formData.append('name', values.name)
    formData.append('email', values.email)
    formData.append('phone', values.phone)
    formData.append('enroll_number', values.enroll_number)
    formData.append('date_of_admission', formatDate(values.date_of_admission))
    const studentId = id?.toString() || ''
    await editStudentMutation.mutateAsync(
      { data: formData, studentId: studentId },
      {
        onSuccess(data) {
          console.log(data)
          message.success('Edit student successfully')
          navigate('/admin/students')
        },
        onError(error) {
          console.log(error)
        }
      }
    )
  }
  const addStudentMutation = useAddStudentMutation()
  const handleAddStudent = async (values: UpdateStudentValus) => {
    console.log('add')
    const formData = new FormData()
    console.log('values', values)
    formData.append('image', values.image.file.originFileObj)
    formData.append('name', values.name)
    formData.append('email', values.email)
    formData.append('phone', values.phone)
    formData.append('enroll_number', values.enroll_number)
    formData.append('date_of_admission', formatDate(values.date_of_admission))
    await addStudentMutation.mutateAsync(formData, {
      onSuccess(data) {
        console.log(data)
        message.success('Edit student successfully')
        navigate('/admin/students')
      },
      onError(error) {
        console.log(error)
      }
    })
  }

  const submit = isAdd ? handleAddStudent : handleEditStudent

  const dummyRequest = async ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  return (
    <div className={styles.updateStudentContainer}>
      <Tittle className={styles.tittleUpdateStudent} text={tittile}></Tittle>
      <Form
        form={form}
        onFinish={submit}
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
          <Upload
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList }) => {
              console.log(fileList)
              setFileList(fileList)
            }}
            listType='picture-card'
            customRequest={dummyRequest}
          >
            <div style={{ border: 0, background: 'none' }}>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
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
