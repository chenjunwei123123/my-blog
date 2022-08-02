import {NextApiRequest,NextApiResponse} from 'next'
import { withIronSessionApiRoute } from "iron-session/next"
import {ironOption} from 'config/index'
import {ISession} from 'pages/api/index'
import {Cookie} from 'next-cookie'
import {clearCookie} from 'utils/index'
export default withIronSessionApiRoute(logout,ironOption)

 async function logout (req:NextApiRequest,res:NextApiResponse) {
  const session:ISession = req.session
  const cookies = Cookie.fromApiRoute(req,res)
  await session.destroy()
  clearCookie(cookies)
  res.send({
    code:0,
    msg:'退出成功',
    data:{}
  })
}