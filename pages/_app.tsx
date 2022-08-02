import '../styles/globals.css'
// import type { AppProps } from 'next/app'
import Layout from 'components/layout'
import {StoreProvider} from 'store/index'
import { NextPage } from 'next'

interface IPorps {
  initialValue:any,
  Component:NextPage,
  pageProps:any
}
function MyApp({initialValue, Component, pageProps }: IPorps) {
  // console.log(initialValue);
  const renderLayout = () => {
    if((Component as any).layout === null ) {
     return <Component {...pageProps} />
    }else {
      return (
        <Layout>
        <Component {...pageProps} />
        </Layout>
      )
    }
  }
  return (
    <StoreProvider initialValue={initialValue}>
        {renderLayout()}
    </StoreProvider>
)
}
MyApp.getInitialProps =async ({ctx}:{ctx:any}) => {
  const {userId,nickname,avatar} = ctx.req?.cookies || {}
  return {
    initialValue:{
      user:{
        userInfo:{
          userId,
          nickname,
          avatar
        }
      }
    }
  }
}
export default MyApp
