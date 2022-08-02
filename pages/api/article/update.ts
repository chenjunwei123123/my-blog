import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {Article,Tag} from 'db/entity'
import {prepareConnect} from 'db/index'

export default withIronSessionApiRoute(update,ironOption)

 async function update (req:NextApiRequest,res:NextApiResponse) {
   const {title = '',content = '',id,tagIds = []} = req.body
   const db = await prepareConnect()
   const articleRepo = db.getRepository(Article)
   const tagRepo = db.getRepository(Tag)
   const article = await articleRepo.findOne({
     where:{
       id
     },
     relations:['user']
   })
   const tags = await tagRepo.find({
    where:tagIds?.map((tagId:number)=>{
      return {id:tagId}
    })
  })
   if(article) {
    article.title = title
    article.content = content
    article.update_time = new Date()
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
        msg:'更新文章成功',
        data:resArticle
      })
     }else {
      res.send({
        code:-1,
        msg:'更新文章失败',
        data:{}
      })
     }
   }else {
    res.send({
      code:-1,
      msg:'未找到文章',
      data:{}
    })
   }


 }