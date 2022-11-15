import React, { FC, useState, useEffect, useRef } from 'react'
import {
  Card,
  Row,
  Col,
  Avatar,
  Descriptions,
  Modal,
  Form,
  List,
  Input,
  message,
  Button,
} from 'antd'
import { useModel } from 'umi'
import { DEFAULT_AVATAR_URL, getSecretPhone, PHONE_REGEXP } from '@/utils/utils'
import { getVerifyCode, resetPassword } from '@/services/api'
import useCanEdit from '@/hooks/useCanEdit'

const FormItem = Form.Item

interface PasswordFormProps {
  modalVisible: boolean
  mobile: string
  handleSubmit: (values: { [name: string]: any }) => void
  handleModalVisible: (visible: boolean) => void
}

const PasswordForm: FC<PasswordFormProps> = props => {
  const { modalVisible, handleSubmit, handleModalVisible, mobile } = props
  const [count, setCount] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()
  const currentCount = useRef(count)
  const [form] = Form.useForm()
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const onCancel = () => {
    handleModalVisible(false)
  }

  const okHandle = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        handleSubmit(values)
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const onGetVerifyCode = async () => {
    await getVerifyCode(mobile)
    message.success('验证码已发送')

    // 一分钟内不允许重复获取
    currentCount.current = 59
    setCount(59)
    timerRef.current = setInterval(() => {
      if (currentCount.current >= 0) {
        setCount(currentCount.current--)
      } else if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }, 1000)
  }

  return (
    <Modal
      maskClosable={false}
      title="修改密码"
      visible={modalVisible}
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form}>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem
              name="verifyCode"
              label="验证码"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input placeholder="验证码" />
            </FormItem>
          </Col>
          <Col span={12}>
            <Button onClick={onGetVerifyCode} disabled={count > 0}>
              {count > 0 ? `${count}s后重新获取` : '获取验证码'}
            </Button>
          </Col>
        </Row>
        <FormItem
          rules={[{ required: true, message: '请输入新密码' }]}
          name="password"
          label="新密码"
        >
          <Input type="password" placeholder="请输入新密码" />
        </FormItem>
      </Form>
    </Modal>
  )
}

const IndexPage: FC = () => {
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const canEdit = useCanEdit()
  const [passwordFormVisible, setPasswordFormVisible] = useState<boolean>(false)

  const mobile = getSecretPhone(currentUser && currentUser.mobile)
  const data = [
    {
      title: '账户密码',
      actions: [canEdit ? <a onClick={() => setPasswordFormVisible(true)}>修改</a> : null],
    },
    {
      title: '密保手机',
      description: `已绑定手机：${mobile}`,
    },
  ]

  const onResetPassword = async (values: { [name: string]: any }) => {
    await resetPassword({ ...values, mobile: currentUser && currentUser.mobile })
    message.success('重置密码成功')
    setPasswordFormVisible(false)
  }

  return (
    <>
      {currentUser && (
        <>
          <Card title="我的账户" style={{ marginBottom: 24 }}>
            <Row>
              <Col md={4} sm={24}>
                <Avatar
                  size="large"
                  src={currentUser.avatar ? currentUser.avatar : DEFAULT_AVATAR_URL}
                />
              </Col>
              <Col md={20} sm={24}>
                <Descriptions>
                  <Descriptions.Item label="用户名">{currentUser.username}</Descriptions.Item>
                  <Descriptions.Item label="姓名">{currentUser.name}</Descriptions.Item>
                  <Descriptions.Item label="手机号">{mobile || '--'}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
          <Card title="安全设置" bordered={false} style={{ marginBottom: 24 }}>
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <List.Item actions={item.actions}>
                  <List.Item.Meta title={item.title} description={item.description} />
                </List.Item>
              )}
            />
          </Card>
          <PasswordForm
            handleModalVisible={v => setPasswordFormVisible(v)}
            modalVisible={passwordFormVisible}
            handleSubmit={onResetPassword}
            mobile={currentUser.mobile}
          />
        </>
      )}
    </>
  )
}
export default IndexPage
