import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {format} from 'date-fns'
import md5 from 'md5'
import {encode} from 'js-base64'
import request from 'servers/fetch'
import {ISession} from 'pages/api/index'
export default withIronSessionApiRoute(sendVerifyCode,ironOption)

 async function sendVerifyCode (req:NextApiRequest,res:NextApiResponse) {
   //由于withIronSessionApiRoute的包裹，req已经存在session
  let session: ISession = req.session
  const {to = '',templateId = ''} = req.body
  const Appid = '8aaf070881ad8ad4018233fb49f722df'
  const AccountId = '8aaf070881ad8ad4018233fb491c22d8'
  const AuthToken = '49240b5ee98c4098a3f5c59fa34e5e05'
  const NowDate = format(new Date(),'yyyyMMddHHmmss')
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`).toUpperCase()
  const Authorization = encode(`${AccountId}:${NowDate}`)
  const verifyCode = Math.floor(Math.random()*(9999-1000))+1000
  const expireMinute = '2'
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`

  const response = await request.post(url,{
    to,
    appId:Appid,
    templateId,
    datas:[verifyCode,expireMinute]
  },{
    headers:{
      Authorization:Authorization
    }
  })

const {statusCode,statusMsg} = response as any
if(statusCode === '000000') {
  //将验证码保存在sessio对象中的verifyCode
  //之后需要用户输入验证码，将验证法发送至服务器，服务器去除session中的验证码校验
  session.verifyCode = verifyCode
  await session.save()
  res.status(200).json({
    code:0,
    msg:statusMsg
  })
}else{
  res.status(200).json({
    code:statusCode,
    msg:statusMsg
  })
}
}
