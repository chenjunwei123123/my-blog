import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {User,UserAuth} from 'db/entity'
import {prepareConnect} from 'db/index'
import {ISession} from 'pages/api/index'
import {Cookie} from 'next-cookie'
import {setCookie} from 'utils/index'

export default withIronSessionApiRoute(update,ironOption)

 async function update (req:NextApiRequest,res:NextApiResponse) {
    const session:ISession = req.session
    const {userId} = session
    const {nickname,job,introduce} = req.body
    const db = await prepareConnect()
    const userRepo = db.getRepository(User)
    const user = await userRepo.findOne({
      where:{
        id:userId
      }
    })
    if(user) {
      user.nickname = nickname
      user.job = job
      user.introduce = introduce
      const resUser = await userRepo.save(user)
      res.send({
        code:0,
        msg:'修改用户成功',
        data:{
          userInfo:resUser
        }
      })
    }else {
      res.send({
        code:0,
        msg:'修改用户失败',
        data:{
          // userInfo:
        }
      })
    }
}
