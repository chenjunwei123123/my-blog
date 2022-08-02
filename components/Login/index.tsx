import styles from './index.module.scss'
import { ChangeEvent, useState } from 'react'
import CountDown from 'components/CountDown'
import { message } from 'antd';
import request from '../../servers/fetch'
import {useStore} from 'store/index'
import {observer} from 'mobx-react-lite'
// import userStore from 'store/userSotre';
interface inProps {
  isShow: boolean,
  onClose: Function
}

const Login = (props: inProps) => {
  const store = useStore()
  const { isShow, onClose } = props
  const [form, setForm] = useState({
    phone: '',
    verify: ''
  })
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)

  const handleClose = () => {
    onClose()
  }
  const handleVerifyCode = () => {
    if (!form.phone) {
      message.warning('请输入手机号');
      return
    }
    // console.log(111);
    request.post('/api/user/sendVerifyCode', {
      to: form?.phone,
      templateId: 1
    }).then((res: any) => {
      if (res?.code === 0) {
        setIsShowVerifyCode(true)
      } else {
        message.error(res?.msg || '未知错误')
      }
    })
  }
  const handleLogin = () => {
    request.post('/api/user/login', {
      ...form,
      identify_type:'phone'
    }).then((res: any) => {
      if (res?.code === 0) {
        //登陆成功
        store.user.setUserInfo(res.data)
        onClose && onClose()
      } else {
        message.error(res?.msg || '未知错误')
      }
    })
  }
    // client-secret:b6f37f0e1653333ff34240a0347527a78795db14
  // client-id:c73c96ccee91dab3bd31
  const handleAuthGithub = () => {
    const githubClientid = 'c73c96ccee91dab3bd31'
    const redirectUri = 'http://localhost:3000/api/oauth/redirect'
    window.open(`https://github.com/login/oauth/authorize?client_id=${githubClientid}&redirect_uri=${redirectUri}`)
    // store.user.setUserInfo(res.data)
        onClose && onClose()
  }
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false)
  }
  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登陆</div>
          <div className={styles.close} onClick={handleClose}>x</div>
        </div>
        <input type="text" name="phone" placeholder="请输入手机号" value={form.phone} onChange={handleFormChange} />
        <div className={styles.verifyCodeArea}>
          <input type="text" name="verify" placeholder="请输入验证码" value={form.verify} onChange={handleFormChange} />
          <span className={styles.verifyCode} onClick={handleVerifyCode}>
            {isShowVerifyCode ? <CountDown time={3} onEnd={handleCountDownEnd} /> : '获取验证码'}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>登陆</div>
        <div className={styles.otherLogin} onClick={handleAuthGithub}>使用github登陆</div>
        <div className={styles.loginPrivacy}>
          注册登陆即表示同意
          <a href="https://moco.imooc.com/privacy.html" target="_blank">隐私政策</a>
        </div>
      </div>
    </div>
  ) : null
}

export default observer(Login)
