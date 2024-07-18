import { Rule } from 'antd/es/form'
import { Form, Input as AntInput } from 'antd'
import styles from './style.module.scss'
interface InputProps {
  name: string
  placeholder?: string
  label?: string
  rules?: Rule[]
  className?: string
  dependencies?: string[]
  initialValue?: string | null
  type?: 'password' | 'text'
}

function Input({ name, placeholder, label, rules, className, dependencies, initialValue, type }: InputProps) {
  const TypeInput = type === 'password' ? AntInput.Password : AntInput
  return (
    <Form.Item name={name} rules={rules} label={label} initialValue={initialValue} dependencies={dependencies}>
      <TypeInput className={`${styles.input} ${className}`} placeholder={placeholder}></TypeInput>
    </Form.Item>
  )
}

export default Input
