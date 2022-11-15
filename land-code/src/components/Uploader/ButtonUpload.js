import React, { useState } from 'react'
import { Upload, Button, Icon, message, Progress } from 'antd'
import { UPLOAD_SERVICE_URL } from '@/services/api'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { upload } from '@/services/aliyunOSS'

const OSSURL = 'http://nb-ai-community.oss-cn-hangzhou.aliyuncs.com/'

export default function ButtonUpload(props) {
  const [loading, setLoading] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const { onChange, children, value, ...reset } = props

  const handleChange = info => {
    const file = info.file
    if (file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (file.status === 'error') {
      setLoading(false)
      message.error('上传失败')
      return
    }
    if (file.status === 'done') {
      setLoading(false)
      onChange && onChange(OSSURL+file.response.name,file.response)
    }
  }
  const uploadAliyunOSS = async ({ file, onSuccess, onError }) => {
    const res = await upload(file,setShowProgress,setProgressValue)
    onSuccess(res)
    setShowProgress(false)
    message.success('上传成功！')
  }
  return (
    <div style={{display:'flex',flexDirection:'column',width:'100%',justifyContent:'center'}}>
      <Upload
        action={UPLOAD_SERVICE_URL}
        maxCount={1}
        showUploadList={false}
        onChange={handleChange}
        {...reset}
        customRequest={uploadAliyunOSS}
      >
        <Button>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          {children}
        </Button>
      </Upload>
      {showProgress&&
        <Progress percent={progressValue}></Progress>
      }
    </div>
  )
}
