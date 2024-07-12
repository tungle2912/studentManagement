import styles from './style.module.scss'
// import InputForm from '../../common/InputForm'
// import Button from '../../common/Button'
import Tittle from '../../common/Tittle'
import { Input, Button } from 'antd'
import { NavLink } from 'react-router-dom'

function Login() {
  // const navigate = useNavigate()
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <div className={styles.loginFormHeader}>
          <Tittle className={styles.loginFormTittle} text='CURD OPERATION'></Tittle>
          <span className={styles.loginSignIn}>SIGN IN</span>
          <p className={styles.loginDescription}>Enter your credentials to access your account</p>
        </div>
        <div className={styles.loginFormContent}>
          {/* <InputForm type='Email'></InputForm>
          <InputForm type='Password'></InputForm> */}
          <div className={styles.loginFormInput}>
            <label>Email</label>
            <Input placeholder='Enter your email' />
          </div>
          <div className={styles.loginFormInput}>
            <label>Password</label>
            <Input.Password className={styles.inputPassword} placeholder='Enter your password' />
          </div>
          {/* onClick={()=>navigate('/home')} */}
          <Button className={styles.loginFormButton} type='primary'>
            <NavLink to={'/home'}>SIGN IN</NavLink>
          </Button>
          {/* <Button text='SIGN IN'></Button> */}
          <p className={styles.loginFormContentDescription}>
            Forgot your password?<a className={styles.loginFormContentReset}>Reset Password</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
