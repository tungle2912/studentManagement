import React, { useState, useEffect } from 'react'
import styles from './style.module.scss'
import { NavLink } from 'react-router-dom'

type Props = {
  text: string
}

function Index({ text }: Props) {
  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    // Dynamic import based on text
    import(`../../assets/icons/${text}.svg`)
      .then((image) => {
        setImgSrc(image.default)
      })
      .catch((err) => console.error('Failed to load image', err))
  }, [text])
  return (
    <NavLink className={styles.navItem} to={`/${text}`}>
      <img className={styles.navImg} src={imgSrc} alt='' />
      <span className={styles.text}>{text}</span>
    </NavLink>
  )
}

export default Index
