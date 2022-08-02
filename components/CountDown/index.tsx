import {useState,useEffect} from 'react'
import styles from './index.module.scss'

interface countDownProps {
  time:number
  onEnd:Function
}
export default function CountDown(props:countDownProps) {
  const {time,onEnd} = props
  const [count,setCount] = useState(time)
  useEffect(()=>{
   const timer = setInterval(()=>{
      setCount((count)=>{
        if(count == 0) {
          clearInterval(timer)
          onEnd && onEnd()
          return count
        }
        return count - 1
      })
    },1000)
    return ()=>{
      clearInterval(timer)
    }
  },[time,onEnd])
  return (
    <div className={styles.countDown}>{count}</div>
  )
}