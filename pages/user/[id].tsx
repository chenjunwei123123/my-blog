import {Button,Avatar, Divider} from 'antd'
import Link from 'next/link'
import {observer} from 'mobx-react-lite'
import styles from './index.module.scss'
import {CodeOutlined,FireOutlined,FundViewOutlined} from '@ant-design/icons'
import {prepareConnect} from 'db/index'
import {User,Article} from 'db/entity'
import ListItem from 'components/ListItem/index'
export async function getServerSideProps({params}:any) {
  const userId = params?.id
  const db = await prepareConnect()
  const user = await db.getRepository(User).findOne({
    where:{
      id:userId
    }
  })
  const articles = await db.getRepository(Article).find({
    where:{
      user:{
        id:userId
      }
    },
    relations:['user','tags']
  })
  return {
    props:{
      userInfo:JSON.parse(JSON.stringify(user)),
      articles:JSON.parse(JSON.stringify(articles))
    }
  }
}

const UserDetail = (props:any) => {
  const {userInfo = {},articles = []} = props
  const {avatar,nickname,introduce,job} = userInfo
  const viewsCount = articles.reduce((prev:any,next:any)=>{
   return prev + next.views
  },0)

  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar src={avatar} className={styles.avatar} size={90}/>
          <div>
            <div className={styles.nickname}>{nickname}</div>
              <div className={styles.desc}>
                <CodeOutlined/> {job}
              </div>
              <div className={styles.desc}>
                <FireOutlined/> {introduce}
            </div>
          </div>
          <Link href="/user/profile">
            <Button>编辑个人资料</Button>
          </Link>
        </div>
        <Divider/>
        <div className={styles.article}>
          {
            articles?.map((article:any)=>(
              <div key={article.id}>
                <ListItem article={article}/>
                <Divider/>
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined/>&nbsp;&nbsp;
              <span>共创作{articles.length}篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined/>&nbsp;&nbsp;
              <span>文章被阅读{viewsCount}次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(UserDetail)
