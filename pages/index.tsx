import {prepareConnect} from 'db/index'
import {Article} from 'db/entity'
import ListItem from 'components/ListItem'
import {Divider} from 'antd'
import {IArticle} from 'pages/api/index'
// interface IArticle {}
interface IProps {
  articles:IArticle[]
}
export async function getServerSideProps() {
  const db = await prepareConnect()
  const articles = await db.getRepository(Article).find({
    relations:['user'],
  })
  // console.log('articles',articles);
  return {
    props:{
      articles:JSON.parse(JSON.stringify(articles)) || []
    }
  }
}

const Home = (props:IProps) => {
  const {articles} = props
  // console.log('articles',articles);
  return (
    <div>
      <div className="content-layout">
        {
        articles?.map(article=>{return (
            <div key={article.id}><ListItem article={article}  />
            <Divider/></div>
        )})
      }
      </div>
    </div>
  )
}

export default Home
