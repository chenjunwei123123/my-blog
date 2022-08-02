import {IronSession} from 'iron-session'
import { IUserInfo } from 'store/userStore'
export type ISession = IronSession & Record<string,any>
export type IComment = {
  id:number,
  create_time: Date,
  update_time: Date,
  content?:string ,
  user:{
    avatar?:string,
    nickname?:string
  }
}
export type IArticle = {
  id:number,
  title:string,
  content:string,
  create_time:Date,
  update_time:Date,
  views:number,
  is_delete:number,
  user:IUserInfo,
  comments:IComment[],tags:[]
}