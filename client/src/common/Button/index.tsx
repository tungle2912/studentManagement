import styles from './style.module.scss'

interface Props {
  text: string
  className?: string
  onClick?(): void
}

function index({ text, className, onClick }: Props) {
  const inputContainerButtonClass = `${styles.inputContainerButton} ${className}`
  return (
    <button onClick={onClick} className={inputContainerButtonClass}>
      {text}
    </button>
  )
}

export default index
