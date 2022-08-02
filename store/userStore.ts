// export type IUserInfo = {
//   userId:number | null,
//   nickname:string,
//   avatar:string,
//   id: number,
// }

// export interface IUserStore {
//   userInfo:IUserInfo,
//   setUserInfo:(value:IUserInfo)=>void
// }

// const userStore = ():IUserStore => {
//   return {
//     userInfo:{
//       userId:null,
//       nickname:'',
//       avatar:'',
//       id:0
//     },
//     setUserInfo:function(value) {
//       this.userInfo = value
//     }
//   }
// }
// export default userStore
export type IUserInfo = {
  userId?: number | null,
  nickname?: string,
  avatar?: string,
  id?: number,
};

export interface IUserStore {
  userInfo: IUserInfo;
  // eslint-disable-next-line no-unused-vars
  setUserInfo: (value: IUserInfo) => void;
}

const userStore = (): IUserStore => {
  return {
    userInfo: {},
    setUserInfo: function (value) {
      this.userInfo = value;
    },
  };
};

export default userStore;
