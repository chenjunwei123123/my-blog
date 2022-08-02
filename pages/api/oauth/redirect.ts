import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {User,UserAuth} from 'db/entity'
import {prepareConnect} from 'db/index'
import {ISession} from 'pages/api/index'
import {Cookie} from 'next-cookie'
import {setCookie} from 'utils/index'
import request from 'servers/fetch'

export default withIronSessionApiRoute(redirect,ironOption)

 async function redirect (req:NextApiRequest,res:NextApiResponse) {
   const session:ISession = req.session
   const cookies = Cookie.fromApiRoute(req,res)
   const {code} = req?.query || {}
   console.log('code',code);
       // client-secret:b6f37f0e1653333ff34240a0347527a78795db14
  // client-id:c73c96ccee91dab3bd31
   const githubClientID = 'c73c96ccee91dab3bd31'
   const githubSecret = 'b6f37f0e1653333ff34240a0347527a78795db14'
   const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecret}&code=${code}`
   const result = await request.post(url,{},{
     headers:{
       accept:'application/json'
     }
   })
   console.log('result',result);

   const {access_token} = result as any
   console.log('access_token',access_token);

   const githubUserInfo = await request.get('https://api.github.com/user',{
     headers:{
       accept:'application/json',
       Authorization:`token ${access_token}`
     }
   })
   console.log('githubUserInfo',githubUserInfo);

    const db = await prepareConnect()
    const userAuth = await db.getRepository(UserAuth).findOne(
      {
        where:{
          identify_type:'github',
          identifer:githubClientID,
        },
        relations:['user']
      }
    )
    console.log('userAuth',userAuth);
      console.log(111);

    if(userAuth) {
      //之前登陆过的github用户，直接从user里面获取用户信息，并且更新credetial
      const user = userAuth.user
      console.log('user',user);
      const {id,nickname,avatar} = user
      userAuth.credential = access_token
      //登陆成功
      session.userId = id
      session.nickname = nickname
      session.avatar = avatar
      await session.save()
      console.log(222);

      setCookie(cookies,{id,nickname,avatar})
      console.log(444);

      res.writeHead(302,{
        location:'/'
      })
    }else {
      //之前未登录过，创建新用户，包括user和user_auth
      const {login = '',avatar_url = ''} = githubUserInfo as any
      const user = new User()
      user.nickname = login
      user.avatar = avatar_url
      const userAuth = new UserAuth()
      userAuth.identify_type = 'github'
      userAuth.identifer = githubClientID
      userAuth.credential = access_token
      userAuth.user = user

      //开始保存至数据库
      const userAuthRepo = db.getRepository(UserAuth)
      const resUserAuth = await userAuthRepo.save(userAuth)
      console.log('resUserAuth',resUserAuth);

      const {id,nickname,avatar} = resUserAuth.user || {}
      setCookie(cookies,{id,nickname,avatar})
      console.log(333);

       //登陆成功
       session.userId = id
       session.nickname = nickname
       session.avatar = avatar
       await session.save()

      //  res.send({
      //    code:0,
      //    msg:'登陆成功',
      //    data:{
      //      userId:id,nickname,avatar
      //    }
      //  })
      res.writeHead(302,{
        location:'/'
      })
    }
 }