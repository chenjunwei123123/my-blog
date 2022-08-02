import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {User,UserAuth} from 'db/entity'
import {prepareConnect} from 'db/index'
import {ISession} from 'pages/api/index'
import {Cookie} from 'next-cookie'
import {setCookie} from 'utils/index'

export default withIronSessionApiRoute(detail,ironOption)

 async function detail (req:NextApiRequest,res:NextApiResponse) {
   const session:ISession = req.session
   const {userId} = session
   const db = await prepareConnect()
   const userRepo = db.getRepository(User)
    const user = await userRepo.findOne({
      where:{
        id:userId
      }
    })
    if(user) {
      res.send({
        code:0,
        msg:'',
        data:{
          userInfo:user
        }
      })
    }else {
      res.send({
        code:-1,
        msg:'未找到该用户',
        data:{
          // userInfo:user
        }
      })
    }
}
