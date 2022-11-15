import { getOssConfig } from './api'
const OSS = require('ali-oss')

let client: any
const getClient = async () => {
  if (!client) {
    const info = await getOssConfig()
    client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: 'oss-cn-hangzhou',
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId: info.id,
      accessKeySecret: info.secret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken: info.token,
      refreshSTSToken: async () => {
        // 向您搭建的STS服务获取临时访问凭证。
        const info = await getOssConfig()
        return {
          accessKeyId: info.id,
          accessKeySecret: info.secret,
          stsToken: info.token,
        }
      },
      // 刷新临时访问凭证的时间间隔，单位为毫秒。
      refreshSTSTokenInterval: 300000,
      // 填写Bucket名称。
      bucket: 'nb-ai-community',
    })
  }
  return client
}

export const getFileNameUUID = () => {
  function rx() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return `${+new Date()}_${rx()}${rx()}`
}
export const upload = async (file: File, changeStatus: any, changeProgress: any) => {
    let temporary = file.name.lastIndexOf('.')
    let fileNameLength = file.name.length
    let fileFormat = file.name.substring(temporary + 1, fileNameLength)
    let fileName = getFileNameUUID() + '.' + fileFormat
    const client = await getClient()
    return client.multipartUpload(fileName, file, {
        progress: function(p: any) {
          //p进度条的值
          changeStatus(true)
          changeProgress(Math.floor(p * 100))
        },
      })
      // .then((result: any) => {
      //   console.log('上传 oss 成功：', result)
      //   return result
      // })
      // .catch((err: any) => {
      //   console.log('err:', err)
      // })
  }
