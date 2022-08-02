import {IArticle} from 'pages/api/index'
import Link from 'next/link'
import styles from './index.module.scss'
import {EyeOutlined} from '@ant-design/icons'
import {Avatar} from 'antd'
import {formatDistanceToNow} from 'date-fns'
import {markdownToTxt} from 'markdown-to-txt'
interface IProps {
  article:IArticle
}
const ListItem = (props:IProps) => {
  const {article} = props
  const {user} = article
  return (
    <Link href={`/article/${article?.id}`}>
      <div className={styles.conteiner}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
              <span className={styles.name}>
                {user?.nickname}
              </span>
              <span className={styles.date}>{formatDistanceToNow(new Date(article?.update_time))}</span>
          </div>
          <h4 className={styles.title}>{article?.title}</h4>
          <p className={styles.content}>{markdownToTxt(article?.content)}</p>
          <div className={styles.statistics}>
            <EyeOutlined/>&nbsp;&nbsp;&nbsp;
            <span>{article?.views}</span>
          </div>
        </div>
        <Avatar src={user?.avatar} size={48}/>
      </div>
    </Link>
  )
}
export default ListItem