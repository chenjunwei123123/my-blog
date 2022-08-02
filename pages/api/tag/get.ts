import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {Tag} from 'db/entity'
import {prepareConnect} from 'db/index'
import {ISession} from 'pages/api/index'
import {Cookie} from 'next-cookie'
import {setCookie} from 'utils/index'

export default withIronSessionApiRoute(get,ironOption)

 async function get (req:NextApiRequest,res:NextApiResponse) {
   const session:ISession = req.session

   const db = await prepareConnect()
   const tagRepo = db.getRepository(Tag)
   const followTags = await tagRepo.find({
     relations:['users'],
     where:{
       users:session.userId
     }
   })
   const allTags = await tagRepo.find({
    relations:['users'],
  })
  res.send({
    code:0,
    msg:'',
    data:{
      followTags,
      allTags
    }
  })
 }