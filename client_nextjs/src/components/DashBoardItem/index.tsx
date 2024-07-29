import React, { useState, useEffect } from 'react'
import styles from './style.module.scss'

type Props = {
  text: string
  number: number | string
  className?: string
}

function Index({ text, number, className }: Props) {
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    // Dynamic import based on text
    import(`../../assets/icons/icon${text}.svg`)
      .then((image) => {
        setImgSrc(image.default)
      })
      .catch((err) => console.error('Failed to load image', err))
  }, [text])
  const dashboardItemClass = `${styles.dashBoardItem} ${className}`
  return (
    <div className={dashboardItemClass}>
      <div className={styles.dashBoardItemContent}>
        <img className={styles.dashBoardItemImg} src={imgSrc} alt='' />
        <span className={styles.dashBoardItemText}>{text}</span>
      </div>
      <span className={styles.dashBoardItemCount}>{number}</span>
    </div>
  )
}

export default Index
