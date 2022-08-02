import React,{ useState,useEffect} from 'react'
import request from 'servers/fetch'
import {observer} from 'mobx-react-lite'
import {Form,Button,message,Input} from 'antd'
import styles from './index.module.scss'

const layout = {
  labelCol:{span:4},
  wrapperCol:{span:16}
}
const tailLayout = {
  wrapperCol:{offset:4}
}
const Profile = () => {
  const [form] = Form.useForm()
  useEffect(()=>{
    request.get('/api/user/detail').then((res:any)=>{
      if(res.code === 0) {
        form.setFieldsValue(res.data.userInfo)
      }
    })
  },[form])
  const handleSubmit = (values:any) => {
    request.post('/api/user/update',{...values}).then((res:any)=>{
      if(res.code === 0) {
        message.success(res.msg || '修改用户成功')
      }else {
        message.error(res.msg || '修改用户失败')
      }
    })
  }
  return (
    <div className="content-layout">
     <div className={styles.userProfile}>
     <h2>个人资料</h2>
      <div>
        <Form {...layout} form={form} className={styles.form} onFinish={handleSubmit}>
          <Form.Item label="用户名" name="nickname">
            <Input placeholder="请输入用户名"></Input>
          </Form.Item>
          <Form.Item label="职位" name="job">
            <Input placeholder="请输入职位"></Input>
          </Form.Item>
          <Form.Item label="个人介绍" name="introduce">
            <Input placeholder="请输入个人介绍"></Input>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">保存修改</Button>
          </Form.Item>
        </Form>
      </div>
     </div>
    </div>
  )
}

export default observer(Profile)