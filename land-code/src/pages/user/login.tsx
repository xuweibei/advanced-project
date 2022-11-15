import { Alert, Checkbox, Form, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { history } from 'umi'
import styles from './login.less'
import LoginFrom from '@/components/Login'
import { accountLogin, checkToken } from '@/services/api'

const { UserName, Password, Submit } = LoginFrom

const LoginMessage: React.FC<{
  content: string
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
)

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {
  const { query } = history.location
  const { redirect } = query as { redirect: string }
  window.location.href = redirect || '/'
}

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false)
  const [autoLogin, setAutoLogin] = useState<boolean>(false)
  const [loginStatus, setLoginStatus] = useState<'success' | 'err' | null>()
  const [form] = Form.useForm()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const login = localStorage.getItem('autoLogin')
    console.log(token, 'sss')

    if (login && login == 'true' && token) {
      setAutoLogin(true)
      checkToken()
        .then(res => {
          goto()
        })
        .catch(e => {
          return
        })
    } else {
      setAutoLogin(false)
    }
  }, [])

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    setLoginStatus(null)
    try {
      // 登录
      const res = await accountLogin({ ...values })

      localStorage.setItem('token', res.token)
      localStorage.setItem('autoLogin', autoLogin.toString())

      message.success('登录成功')
      goto()
    } catch (error) {
      setLoginStatus('err')
    }
    setSubmitting(false)
  }
  console.log(autoLogin, 'login')

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.leftTitle}>
              <img src={require('../../assets/images/login_banner.png')} alt="" />
            </div>
            <div className={styles.leftContent}>数字地产云管理系统</div>
          </div>
          <div className={styles.right}>
            <div className={styles.desc}>
              <div className={styles.rightTitle}>NewHome</div>
              <div className={styles.rightContent}>数字地产云管理系统</div>
            </div>
            <div>
              {loginStatus === 'err' && !submitting ? (
                <LoginMessage content="账户或密码错误!!" />
              ) : null}

              <LoginFrom form={form} onSubmit={handleSubmit}>
                <UserName
                  name="username"
                  placeholder="用户名"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                  className={styles.border}
                />
                <Password
                  name="password"
                  placeholder="密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                  className={styles.border}
                />
                <Checkbox checked={autoLogin} onChange={v => setAutoLogin(v.target.checked)}>
                  自动登入
                </Checkbox>
                <Submit loading={submitting}>登录</Submit>
              </LoginFrom>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
