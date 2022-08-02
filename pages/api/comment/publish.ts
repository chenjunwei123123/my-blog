import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {User,Article,Comment} from 'db/entity'
import {prepareConnect} from 'db/index'
import {ISession} from 'pages/api/index'

export default withIronSessionApiRoute(publish,ironOption)

 async function publish (req:NextApiRequest,res:NextApiResponse) {
   const session:ISession = req.session
   const {articleId = 0,content = ''} = req.body

   const db = await prepareConnect()
   const commentRepo = db.getRepository(Comment)
   const userRepo = db.getRepository(User)
   const articleRepo = db.getRepository(Article)

   const comment = new Comment()

   comment.content = content
   comment.create_time = new Date()
   comment.update_time = new Date()

   const user = await userRepo.findOne({
    where:{
      id:session?.userId
    }
   })
   console.log('user',user);

   const article = await articleRepo.findOne({
    where:{
      id:articleId
    }
   })
   console.log('article',article);

   if(user) {
     comment.user = user
   }
   if(article ){
    comment.article = article
   }


   const resComment = await commentRepo.save(comment)
   console.log(resComment);

   if(resComment) {
    res.send({
      code:0,
      msg:'发布评论成功',
      data:resComment
    })
   }else {
    res.send({
      code:-1,
      msg:'发布评论失败',
      data:{}
    })
   }
 }