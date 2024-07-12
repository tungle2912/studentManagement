import styles from './style.module.scss'

interface Props {
  text: string
  className?: string
}

function index({ text, className }: Props) {
  const inputContainerButtonClass = `${styles.inputContainerButton} ${className}`
  return <button className={inputContainerButtonClass}>{text}</button>
}

export default index
