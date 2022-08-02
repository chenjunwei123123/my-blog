// import type { NextPage } from 'next'
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState ,useEffect} from "react";
import styles from './index.module.scss'
import {Input,Button,message,Select} from 'antd'
import request from 'servers/fetch'
import {observer} from 'mobx-react-lite'
import {useStore} from 'store/index'
import {useRouter} from 'next/router'
// import request from 'servers/fetch'
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

const NewEditor = () => {
  const [content, setContent] = useState('');
  const [title,setTitle] = useState('')
  const store = useStore()
  const {userId} = store.user.userInfo
  const {push} = useRouter()
  const [allTags,setAllTags] = useState([])
  const [tagIds,settagIds] = useState([])
  useEffect(()=>{
    request.get('/api/tag/get').then((res:any)=>{
      if(res?.code === 0) {
        setAllTags(res?.data.allTags || [])
      }
    })
  },[])
  const handlePublish = () => {
    if(!title) {
      message.warning('请输入文章标题')
    }else {
      request.post('/api/article/publish',{
        title,
        content,
        tagIds
      }).then((res:any)=>{
        if(res?.code === 0) {
          //跳转到个人主页
          userId ? push(`/user/${userId}`) : push('/')
          message.success('文章发布成功 ')
        }else {
          message.error(res?.msg || '文章发布失败')
        }
      })
    }
  }
  const handleTitleChange = (e:any) => {
    setTitle(e.target.value)
  }
  const handleContentChange = (content : any) => {
    setContent(content)
  }
  const handleSelectTag = (value:[]) => {
    settagIds(value)
  }
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange}/>
        <Select className={styles.tag} mode="multiple" allowClear placeholder="请选择标签" onChange={handleSelectTag}>{allTags?.map((tag:any)=>(
          <Select.Option key={tag?.id} value={tag?.id}>{tag?.title}</Select.Option>
        ))}</Select>
        <Button type="primary" onClick={handlePublish} className={styles.button}>发布文章</Button>
      </div>
      <MDEditor value={content} onChange={handleContentChange} height={1080}/>
    </div>
  );
}

NewEditor.layout = null as any
export default observer(NewEditor)