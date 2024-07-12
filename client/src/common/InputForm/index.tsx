import styles from './style.module.scss'


interface Props {
  type: string
}
function index({ type }: Props) {
  return (
    <div className={styles.inputContainer}>
      <p className={styles.inputContainerLabel}>{type}</p>   
      <input
        className={styles.inputContainerInput}
        type={type}
        placeholder={`Enter your ${type.toLocaleLowerCase()}`}
      />
    </div>
  )
}

export default index
