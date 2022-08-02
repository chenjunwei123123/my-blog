import {prepareConnect} from 'db/index'
import {Article} from 'db/entity'
import {IArticle} from 'pages/api/index'
import styles from './index.module.scss'
import {Avatar,Input,Button, message, Divider} from 'antd'
import {format} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {useStore} from 'store/index'
import Link from 'next/link'
import Markdown from 'markdown-to-jsx'
import {useState} from 'react'
import request from 'servers/fetch'
import {IComment} from 'pages/api/index'
interface IProps {
  article:IArticle
}

//直接执行，从params中取出文章id，根据id向数据库求取对应数据
export async function getServerSideProps({params}:any) {
  const articleId = params?.id
  const db = await prepareConnect()
  const articleRepo = db.getRepository(Article)
  const article = await db.getRepository(Article).findOne({
    where:{
      id:articleId
    },
    relations:['user','comments','comments.user'],
  })
  if(article) {
    //阅读次数+1
    article.views += 1
    await articleRepo.save(article)
  }
  return {
    props:{
      article:JSON.parse(JSON.stringify(article))
    }
  }
}

const ArticleDetail = (props:IProps) => {
  const {article} = props
  const {user:{nickname,avatar,id}} = article
  const {title,content,update_time,views} = article
  const [inputValue,setInputValue] = useState('')
  const [comments,setComments] = useState<IComment[]>(article?.comments)
  const store = useStore()
  const loginUserInfo = store.user.userInfo
  const handleCommentChange = (e : any) => {
    setInputValue(e?.target.value)
  }
  const handleComment = () => {
    request.post('/api/comment/publish',{
      articleId:id,
      content:inputValue
    }).then((res:any)=>{
      if(res?.code === 0) {
        setInputValue('')
        const com:IComment =  {
          id:Math.random(),
          create_time:new Date(),
          update_time:new Date(),
          content:inputValue,
          user:{
            avatar:loginUserInfo.avatar,
            nickname:loginUserInfo.nickname
          }
        }
        const newComment:IComment[] = [
          com
        ].concat([...comments])
        console.log();

        setComments(newComment)
        message.success('评论发表成功')
      }else {
        message.error('评论发表失败')
      }
    })
  }
  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50}/>
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div className={styles.date}>{format(new Date(update_time),'yyyy-MM-dd hh:mm:ss')}</div>
              <div className={styles.view}>阅读:{views}</div>
              {
                Number(loginUserInfo?.userId) === Number(id) ? (
                  <Link href={`/editor/${id}`}>
                    编辑
                  </Link>
                ):null
              }
            </div>
          </div>
        </div>
          <Markdown className={styles.markdown}>{content}</Markdown>
      </div>
        <div className={styles.divider}></div>
        <div className='content-layout'>
          <div className={styles.comment}>
            <h3>评论</h3>
            {
              loginUserInfo.userId && (
                <div className={styles.enter}>
                  <Avatar src={avatar}/>
                  <div className={styles.content}>
                    <Input.TextArea placeholder='请输入评论' rows={4} value={inputValue} onChange={handleCommentChange}>
                    </Input.TextArea>
                    <Button type="primary" onClick={handleComment}>发表</Button>
                  </div>
                </div>
              )
            }
            <Divider/>
            <div className={styles.display}>
              {
                comments?.map((comment:any)=>(
                  <div className={styles.wrapper} key={comment.id}>
                    <Avatar src={avatar} size={40}/>
                    <div className={styles.info}>
                      <div className={styles.name}>
                        <div>{comment.user.nickname}</div>
                        <div className={styles.date}>{format(new Date(comment?.update_time),'yyyy-MM-dd hh:mm:ss')}</div>
                      </div>
                      <div className={styles.content}>{comment?.content}</div>
                    </div>
                    <div className={styles.dividersx}></div>
                  </div>

                ))
              }
            </div>
          </div>
        </div>

    </div>
  )
}
export default observer(ArticleDetail)