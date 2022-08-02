// import type { NextPage } from 'next'
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState,useEffect } from "react";
import styles from './index.module.scss'
import {Input,Button,message,Select} from 'antd'
import request from 'servers/fetch'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import {prepareConnect} from 'db/index'
import {Article} from 'db/entity'
import {IArticle} from 'pages/api'

interface IProps {
  article:IArticle
}
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export async function getServerSideProps({params}:any) {
  const articleId = params?.id
  const db = await prepareConnect()
  const article = await db.getRepository(Article).findOne({
    where:{
      id:articleId
    },
    relations:['user','tags'],
  })
  return {
    props:{
      article:JSON.parse(JSON.stringify(article))
    }
  }
}

const ModifyEditor = ({article}:IProps) => {
  // const {title = '',content = ''} = article
  const [content, setContent] = useState(article?.content || '');
  const [title,setTitle] = useState(article?.title || '')
  const [allTags,setAllTags] = useState(article?.tags || [])
  const [tagIds,settagIds] = useState([])
  const allTagsIds:any = []
  allTags.map((tag:any)=>allTagsIds.push(tag?.id))
  const {push,query} = useRouter()
  const articleId = Number(query?.id)
  useEffect(()=>{
    request.get('/api/tag/get').then((res:any)=>{
      if(res?.code === 0) {
        console.log('allTags2',res?.data.allTags);
        setAllTags(res?.data.allTags || [])
      }
    })
  },[])
  const handlePublish = () => {
    if(!title) {
      message.warning('请输入文章标题')
    }else {
      request.post('/api/article/update',{
        id:articleId,
        title,
        content,
        tagIds
      }).then((res:any)=>{
        if(res?.code === 0) {
          //跳转到个人主页
          articleId ? push(`/article/${articleId}`) : push('/')
          message.success('文章修改成功 ')
        }else {
          message.error(res?.msg || '文章修改失败')
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
        <Select defaultValue={allTagsIds} className={styles.tag} mode="multiple" allowClear placeholder="请选择标签" onChange={handleSelectTag} >{allTags?.map((tag:any)=>(
          <Select.Option key={tag?.id} value={tag?.id}>{tag?.title}</Select.Option>
        ))}</Select>
        <Button type="primary" onClick={handlePublish} className={styles.button}>发布文章</Button>
      </div>
      <MDEditor value={content} onChange={handleContentChange} height={1080}/>
    </div>
  );
}

ModifyEditor.layout = null as any
export default observer(ModifyEditor)