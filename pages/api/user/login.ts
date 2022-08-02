import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {User,UserAuth} from 'db/entity'
import {prepareConnect} from 'db/index'
import {ISession} from 'pages/api/index'
import {Cookie} from 'next-cookie'
import {setCookie} from 'utils/index'

export default withIronSessionApiRoute(login,ironOption)

 async function login (req:NextApiRequest,res:NextApiResponse) {
   const session:ISession = req.session
   const {phone = '',verify = '',identify_type = 'phone'} = req.body
   const db = await prepareConnect()
   const userRepo = db.getRepository(User)
   const cookies = Cookie.fromApiRoute(req,res)
   const userAuthRepo = db.getRepository(UserAuth)
  //  session.verifyCode是求取验证码时候保存至session中的
   if(String(session.verifyCode) == verify) {
    //验证码正确，同时需要user_Auth中的登陆方式(identity_type),那么在前端界面调用用户登陆接口时就需要先将登陆方式传过来,在user_Auth里面identity_type是否有记录
    const userAuth = await userAuthRepo.findOne(
      {
      where:{
        identify_type,
        identifer:phone
      },
      relations:['user']
      }
    )
    if(userAuth) {
      //已注册用户
      const user = userAuth.user
      const {id,nickname,avatar} = user
      session.userId = id
      session.nickname = nickname
      session.avatar = avatar
      await session.save()
      setCookie(cookies,{id,nickname,avatar})
      res.send({code:0,msg:'登陆成功',data:{
        userId:id,
        nickname,
        avatar
      }})
    }else {
      // 新用户,自动注册
      const user = new User()
      user.nickname = `用户_${Math.floor(Math.random()*10000)}`
      user.avatar = '/images/avatar.jpg'
      user.job = '暂无'
      user.introduce = '暂无'
      const userAuth = new UserAuth()
      userAuth.identifer = phone
      userAuth.identify_type = identify_type
      userAuth.credential = session.verifyCode
      userAuth.user = user
      const resUserAuth = await userAuthRepo.save(userAuth)
      const {user:{id,nickname,avatar}} = resUserAuth
      session.userId = id
      session.nickname = nickname
      session.avatar = avatar
      await session.sava()
      //保存登陆态至cookie,页面刷新时可从cookie取状态存储至全局store
      setCookie(cookies,{id,nickname,avatar})
      res.send({code:0,msg:'登陆成功',data:{
        userId:id,
        nickname,
        avatar
      }})
    }
  }else {
    //验证码输入错误
    res.send({code:-1,msg:'验证码错误'})
  }
}
