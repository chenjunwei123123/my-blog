// import userStore ,{IUserStore} from './userSotre'

// export interface IStore {
//   user:IUserStore
// }
// export default function createStore(initialValue:any):()  => IStore {
//   return ()=>{
//     return {
//       user:{...userStore,...initialValue?.user},
//       // article:{...userStore,...initialValue?.user},
//     }
//   }
// }
import userStore, { IUserStore } from './userStore';

export interface IStore {
  user: IUserStore;
}

export default function createStore(initialValue: any): () => IStore {
  return () => {
    return {
      user: { ...userStore(), ...initialValue?.user },
    };
  };
}
