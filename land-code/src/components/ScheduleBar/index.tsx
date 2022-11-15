import React,{useRef,useEffect,useState} from 'react'
import styles from './index.less'
import finishImg from '@/assets/images/finishImg.png'
import unfinishImg from '@/assets/images/unfinishImg.png'

function index(props: any) {
  const { percent,className } = props
  const [width,setWidth]=useState<any>()
  const ref = useRef(null)
  useEffect(() => {
    const width = ref&&ref.current ? ref.current?.offsetWidth : 0;
    setWidth(width)
  }, [ref.current])
  
  const count = (width - 10) / 10 //格子总数
  const finish = parseInt((count * parseFloat(percent)).toString()) //完成格子数
  const unfinish = count - finish //未完成格子数
  //console.log(count,finish,unfinish,'1111')

  var finishList = []
  for (var i = 1; i <= finish; i++) {
    finishList.push(i)
  }

  var unfinishList = []
  for (var j = 1; j <= unfinish; j++) {
    unfinishList.push(j)
  }

  return (
    <div ref={ref} className={className} style={{ display: 'flex' }}>
      {finishList.map(item => {
        return <img key={item} src={finishImg} className={styles.img} />
      })}
      {unfinishList.map(item => {
        return <img key={item} src={unfinishImg} className={styles.img} />
      })}
    </div>
  )
}

export default index
