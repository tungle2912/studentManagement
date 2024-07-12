import styles from './style.module.scss'
import iconSearch from '../../assets/icons/search.svg'

function index() {
  return (
    <div className={styles.search}>
      <input className={styles.searchInput} placeholder='Search...' type='text' />
      <img className={styles.searchIcon} src={iconSearch} alt='' />
    </div>
  )
}

export default index
