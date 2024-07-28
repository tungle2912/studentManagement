import React from 'react'
import styles from './style.module.scss'

interface Props {
  text: string
}
function index({ text }: Props) {
  return <div className={styles.title}>{text}</div>
}

export default index
