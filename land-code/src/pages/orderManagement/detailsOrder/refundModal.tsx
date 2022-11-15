import { Button, Modal, Form, Input } from 'antd'
import React, { useRef, useState } from 'react'
import {  history} from 'umi'
import { refundOrder } from '@/services/api'
export interface propinterface {
  totalAmount?: any
  id?: Number
}

const App: React.FC<propinterface> = props => {
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('退款')
  const [value, setValue] = useState('')
  const FormItem = Form.Item
  const [form] = Form.useForm()
  const { TextArea } = Input
  const formRef = useRef(null)
  const { totalAmount, id } = props
  const showModal = () => {
    setVisible(true)
  }

  //DOM结构
  const modelDOM = () => {
    return (
      <Form form={form} ref={formRef} layout="inline">
        <FormItem label="" name="remark">
          <TextArea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="请输入退款原因"
            autoSize={{ minRows: 5, maxRows: 10 }}
            style={{ width: '474px', resize: 'none', marginTop: '3%' }}
          />
        </FormItem>
      </Form>
    )
  }
  const handleOk = () => {
    form
      .validateFields()
      .then((res: any) => {
        refundOrder({ orderId:id || null, remark: res.remark || null }).then(res => {
            setConfirmLoading(true)
          setTimeout(() => {
            setVisible(false)
            setConfirmLoading(false)
            history.push('/orderManagement/listOfOrder')
          }, 2000)
          form.resetFields()
        })
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        退款
      </Button>
      <Modal
        forceRender
        title="发起退款"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {/* <p>{modalText}</p>
        modelDOM() */}
        <span>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>退款金额：</span>
            <span>{totalAmount}</span>
          </div>
          {modelDOM()}
        </span>
      </Modal>
    </>
  )
}

export default App
