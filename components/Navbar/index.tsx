import {useState} from 'react'
import styles from './index.module.scss'
import {observer} from 'mobx-react-lite'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {navs} from './config'
import {Button,Avatar,Dropdown,Menu, message} from 'antd'
import {LoginOutlined,HomeOutlined} from '@ant-design/icons'
import Login from 'components/Login'
import {useStore} from 'store/index'
import request from 'servers/fetch'
const Navbar = () => {
  const store = useStore()
  const {userId = '',avatar = ''} = store.user.userInfo
  const [isShowLogin,setIsShowLogin] = useState(false)
  //当前跳转页面路由
  const {pathname,push} = useRouter()
  //写博客事件
  const handleGotoEditorPage = () => {
    //进入文章发布页面
    if(userId) {
      push('/editor/new')
    }else {
      message.warning('请先登录')
    }
  }
  //登陆事件
  const handleLogin = () => {
    console.log('$$$$',userId);

    setIsShowLogin(true)
  }
  //关闭登陆窗口事件
  const handleClose = () => {
    setIsShowLogin(false)
  }
  const handleLogout = () => {
    request.post('/api/user/logout').then((res:any)=>{
      if(res?.code === 0) {
        store.user.setUserInfo({})
      }
    })
  }
  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`)
  }
  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}><HomeOutlined/>&nbsp;个人主页</Menu.Item>
        <Menu.Item onClick={handleLogout}><LoginOutlined/>&nbsp;退出系统</Menu.Item>
      </Menu>
    )
  }
  return (
    <div className={styles.navbar}>
      <section className={styles.logArea}>BLOG</section>
      <section className={styles.linkArea}>
       {
          navs?.map((nav) => {
            return (
              <Link key={nav?.label} href={nav?.value}>
                <a className={pathname === nav?.value ? styles.active : ''}>{nav?.label}</a>
              </Link>
            )
          })
       }
      </section>
      <section className={styles.operaArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {
          userId ? (
            <Dropdown overlay={renderDropDownMenu} placement='bottomLeft'>
              <Avatar src={avatar} size={32}></Avatar>
            </Dropdown>
          ) : <Button type="primary" onClick={handleLogin}>登陆</Button>
        }
      </section>
      {/* 登陆组件 */}
      {
        isShowLogin ? <Login isShow={isShowLogin} onClose={handleClose}/> : null
      }
    </div>
  )
}
export default observer(Navbar)
