import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {Tag,User} from 'db/entity'
import {prepareConnect} from 'db/index'
import {ISession} from 'pages/api/index'
import {Cookie} from 'next-cookie'
import {setCookie} from 'utils/index'

export default withIronSessionApiRoute(follow,ironOption)

 async function follow (req:NextApiRequest,res:NextApiResponse) {
   const session:ISession = req.session
   const {userId} = session
   const {tagId,type} = req.body

   const db = await prepareConnect()
   const tagRepo = db.getRepository(Tag)
   const userRepo = db.getRepository(User)
   const user = await userRepo.findOne({
     where:{
       id:userId
     }
   })
   const tag = await tagRepo.findOne({
     relations:['users'],
    where:{
      id:tagId
    }
  })
  if(!user) {
    res.send({
      code:-1,
      msg:'您还未登录',
      data:{
      }
    })
  return
  }
  if(tag?.users) {
    if(type === 'follow') {
      tag.users = tag?.users.concat([user])
      tag.follow_count += 1
    }else if(type === 'unfollow') {
      tag.users = tag?.users.filter(user=>user.id != userId)
      tag.follow_count += 1
    }
  }
  if(tag) {
    const resTag = await tagRepo.save(tag)
    res.send({
      code:0,
      msg:'',
      data:resTag
    })
  }else {
    res.send({
      code:-1,
      msg:'关注/取关失败',
      data:{}
    })
  }
 }