import React from 'react'
import styles from './style.module.scss'

interface Props {
  text: string
  className?: string
}
function Tittle({ text, className }: Props) {
  const tittleClass = `${styles.tittle} ${className}`
  return <div className={tittleClass}>{text}</div>
}

export default Tittle
