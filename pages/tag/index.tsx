import React,{ useState,useEffect} from 'react'
import {Tabs,Button,message} from 'antd'
import request from 'servers/fetch'
import {observer} from 'mobx-react-lite'
import {useStore} from 'store/index'
import {useRouter} from 'next/router'
import styles from './index.module.scss'
import * as ANTD_ICONS from '@ant-design/icons'
const {TabPane} = Tabs

interface IUser {
  id:number,
  nickname:string,
  avatar:string
}
interface ITag {
  id:number,
  title:string,
  icon:string,
  follow_count:number,
  article_count:number,
  users:IUser[]
}
const Tag:React.FC = () => {
  const store = useStore()
  const [followTags,setFollowTags] = useState<ITag[]>()
  const [allTags,setAllTags] = useState<ITag[]>()
  const {userId} = store?.user?.userInfo
  const [needRefresh,setNeedRefresh] = useState(false)
  useEffect(()=>{
    request.get('/api/tag/get').then((res:any)=>{
      if(res?.code === 0) {
        const {followTags = [],allTags = []} = res?.data
        setFollowTags(followTags)
        setAllTags(allTags)
      }
    })
  },[needRefresh])
  const onChange = (key: string) => {
    console.log(key);
  };
  const handleUnFollow = (tagId:any) => {
    request.post('/api/tag/follow',{
      type:'unfollow',
      tagId
    }).then((res:any)=>{
      if(res?.code === 0) {
        const {msg} = res
        setNeedRefresh(!needRefresh)
        message.success(msg || '取消关注成功')
      }else {
        const {msg} = res
        message.error(msg || '关注失败')
      }
    })
  }
  const handleFollow = (tagId:any) => {
    request.post('/api/tag/follow',{
      type:'follow',
      tagId
    }).then((res:any)=>{
      if(res?.code === 0) {
        const {msg} = res
        setNeedRefresh(!needRefresh)
        message.success(msg || '关注成功')
      }else {
        const {msg} = res
        message.error(msg || '关注失败')
      }
    })
  }
  return (
    <div className='content-layout'>
      <Tabs defaultActiveKey="follow" onChange={onChange}>
        <TabPane tab="已关注标签" key="follow" className={styles.tag}>
          {
            followTags?.map((tag:ITag)=>(
              <div key={tag?.title} className={styles.tagWrapper}>
                <div>{(ANTD_ICONS as any)[tag?.icon].render()}</div>
                <div className={styles.title}>{tag?.title}</div>
                <div>{tag?.follow_count}关注{tag?.article_count}文章</div>
                {
                  tag?.users?.find((user) => Number(user?.id) === Number(userId)) ? (
                    <Button type="primary" onClick={() => { handleUnFollow(tag?.id) }}>已关注</Button>
                  ) : <Button onClick={() => { handleFollow(tag?.id) }}>关注</Button>
                }
              </div >
            ))
          }
        </TabPane>
        <TabPane tab="全部标签" key="all" className={styles.tag}>
          {
            allTags?.map((tag) => (
              <div key={tag.title} className={styles.tagWrapper}>
                <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
                <div className={styles.title}>{tag.title}</div>
                <div>{tag.follow_count}关注 {tag.article_count}文章</div>
                {
                  tag?.users?.find((user) => Number(user?.id) === Number(userId)) ? (
                    <Button type="primary" onClick={() => { handleUnFollow(tag?.id) }}>已关注</Button>
                  ) : <Button onClick={() => { handleFollow(tag?.id) }}>关注</Button>
                }
              </div>
            ))
          }
        </TabPane>
  </Tabs>
    </div>
  )
}

export default observer(Tag)
