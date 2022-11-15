import React, { useEffect, useState } from 'react'
import styles from './index.less'
import RefundModal from './refundModal'
import { Button } from 'antd'
import { querytetail} from '@/services/api'
/**
 * 此方法会跳转到 redirect 参数所在的位置
 */

const listOfOrder = (props: any) => {
  const [data, setData] = useState<any>(null)
  // const [totalAmount, setTotalAmount] = useState<any>(null)
  useEffect(() => {
    querytetail(props.match.params.id).then(res => {
      setData(res)
    })
  }, [])
  // 订单下拉框选择
  const Status = [
    { id: 1, name: '待支付' },
    { id: 2, name: '已取消' },
    { id: 3, name: '已支付' },
    { id: 4, name: '已完成' },
    { id: 5, name: '申请退款' },
    { id: 6, name: '已退款' },
  ]
  //订单详情+收货人信息
  const order = [
    { id: 0, name: '订单详情', name2: [], obj: '' },
    { id: 1, name: '状态：', name2: [], obj: 'orderStatus' },
    { id: 2, name: '订单号：', name2: [], obj: 'orderSn' },
    { id: 3,name: '商品名：', name2: [{ name: '创建时间：', obj: 'createdTime' }],obj: 'goodsName'},
    { id: 4, name: '数量：', name2: [{ name: '付款时间：', obj: 'payTime' }], obj: 'quantity' },
    { id: 5, name: '订单总金额：', name2: [{ name: '完成时间：', obj: 'finishTime' }], obj: 'totalAmount' },
    { id: 6, name: '支付方式：', name2: [], obj: 'subTenderType' },
    { id: 7, name: '收货人信息', name2: [], obj: '' },
    { id: 8, name: '收货人：', name2: [{ name: '手机号', obj: 'phone' }], obj: 'customerName' },
    { id: 9, name: '收货地址：', name2: [], obj: 'address' },
    { id: 10, name: '退款详情', name2: [], obj: '' },
    { id: 11, name: '退款理由：', name2: [], obj: 'remark' },
    { id: 12, name: '退款人：', name2: [], obj: 'customerName' },
    { id: 13, name: '退款时间：', name2: [], obj: 'refundTime' },
    { id: 14, name: '退款金额：', name2: [], obj: 'totalAmount' },
  ]
  // 订单列表支付方式
  const type = [
    { label: 302, value: '支付宝' },
    { label: 301, value: '微信' },
  ]  
  const subTenderType = (num:Number)=>{
    return  type.map(item=>{
     return item.label===num?item.value:''
    })
  }
  //页面布局
  const listOfOrderView = () => {
    return order.map((item: any, index: any) => {
      return (
        <div className={styles.nameBox} key={index}>
          <a>{item.id == 0 || item.id == 7 ? item.name : ''}</a>
          <div className={styles.name}>
            <div>
              {/* 订单详情+收货人信息 */}
              <div>
                {item.id !== 0 && item.id !== 7 && item.id < 10 ? item.name : ''}
                <span className={item.id == 1 ? styles.fontSize : ''}>
                  {item.id == 1 &&
                    Status.map((itemS: any) => {
                      return (data && data[item.obj]) === itemS.id ? itemS.name : ''
                    })}
                  {data && (item.id < 10&&item.id !== 1) && (item.id===6?subTenderType(data[item.obj]):data[item.obj])}
                </span>
              </div>
              {/* //退款信息 */}
           {data&&data.orderStatus==6&&<div>
              <a>{item.id == 10 ? item.name : ''}</a>
               <span>{item.id > 10 ? item.name : ''}</span>
                <span >
                  {data && item.id > 10 && data[item.obj]}
                </span>
              </div>}
            </div>
            <div>
              {item.name2.map((item1: any, index1: any) => {
                return (
                  <div key={index1}>
                    {data && data[item1.obj] ? item1.name : ''}
                    {data && data[item1.obj]}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <div>
        {listOfOrderView()}
        <div className={styles.refund}>
          { (data&&(data.orderStatus == 3 || data.orderStatus == 4)) && <RefundModal id={props.match.params.id} totalAmount={data && data.totalAmount} />}
        </div>
      </div>
    </>
  )
}

export default listOfOrder
