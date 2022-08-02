import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {User,Article,Tag} from 'db/entity'
import {prepareConnect} from 'db/index'
import {ISession} from 'pages/api/index'

export default withIronSessionApiRoute(publish,ironOption)

 async function publish (req:NextApiRequest,res:NextApiResponse) {
   const session:ISession = req.session
   const {title = '',content = '',tagIds = []} = req.body
   const db = await prepareConnect()
   const userRepo = db.getRepository(User)
   const articleRepo = db.getRepository(Article)
   const tagRepo = db.getRepository(Tag)
   const user = await userRepo.findOne({
     where:{
      id:session.userId
     }
   })
   const tags = await tagRepo.find({
    where:tagIds?.map((tagId:number)=>{
      return {id:tagId}
    })
  })

   const article = new Article()
   article.title = title
   article.content = content
   article.create_time = new Date()
   article.update_time = new Date()
   article.is_delete = 0
   article.views = 0
   if(user) {
     article.user = user
   }
   if(tags) {
    const newTags = tags.map((tag)=>{
      tag.article_count = tag.article_count + 1
      return tag
    })
   article.tags = newTags
  }
   const resArticle = await articleRepo.save(article)
   if(resArticle) {
    res.send({
      code:0,
      msg:'发布文章成功',
      data:resArticle
    })
   }else {
    res.send({
      code:-1,
      msg:'发布文章失败',
      data:{}
    })
   }
 }