import { parse } from 'qs'
import moment from 'moment'

export const NUMBER = /^0|([1-9]\d*)$/
export const PHONE_REGEXP = /^1[3456789]\d{9}$/

export function getPageQuery() {
  return parse(window.location.href.split('?')[1])
}

export const havePermission = (permissions: any, path: any) => {
  return (
    permissions &&
    permissions.find((permission: any) => {
      const arr1 = permission.path.split('/')
      const arr2 = path.split('/')
      if (permission.isLeafNode && arr1.every((item: any, index: any) => item === arr2[index])) {
        return true
      }
    })
  )
}

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export const isUrl = (path: string): boolean => reg.test(path)

export function getSecretPhone(phone: any) {
  if (!phone) {
    return
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2')
}

// 默认头像地址
export const DEFAULT_AVATAR_URL =
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575614673388&di=9524a6095ca63e0d7f69cd8e9a795ea6&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170901%2Ffc6a2a3b00b54aa68f4f11174def5c75.jpeg'

export const arrayToTree = <T extends { [key: string]: any }>(
  arr: T[],
  options?: {
    key?: string
    parentKey?: string
    childrenKey?: string
  }
) => {
  const { key, parentKey, childrenKey } = Object.assign(
    {
      key: 'id',
      parentKey: 'parentID',
      childrenKey: 'children',
    },
    options
  )
  const rootItems: T[] = []
  const map: { [key: string]: T } = {}

  arr.forEach(item => {
    const itemID = item[key]
    const parentID = item[parentKey]

    if (!map[itemID]) {
      map[itemID] = { ...item, [childrenKey]: [] }
    } else {
      // 说明先遍历到自己的 child
      map[itemID] = { ...item, [childrenKey]: map[itemID][childrenKey] }
    }

    if (!parentID) {
      rootItems.push(map[itemID])
    } else {
      map[parentID] = map[parentID] || { [childrenKey]: [] }
      map[parentID][childrenKey].push(map[itemID])
    }
  })

  return rootItems
}

//三级联动搜索
export const LinkageSearch = () => {
  console.log('三级联动选择框')
}

export const disabledDate = (current: any) => {
  return current && current > moment().endOf('day')
}

export function removeEmptyKey(obj) {
  if (!obj) {
    return obj
  }
  for (let [k, v] of Object.entries(obj)) {
    if (!v) {
      delete obj[k]
    }
  }
  return obj
}

const GenderList = [
  {
    context: '男',
    gender: 1,
  },
  {
    context: '女',
    gender: 2,
  },
]

export const getGender = (data: any) => {
  let userGender = GenderList.find(item => item.gender == data)
  return userGender && userGender.context
}
export const getStrCount = (str: any, char: any) => {
  let regex = new RegExp(char, 'g') // 使用g表示整个字符串都要匹配
  let result = str.match(regex) //match方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
  let count = !result ? 0 : result.length
  return count
}

export const ServiceList = [
  { value: 'SmartHome', name: '智能家居' },
  { value: 'cloudTalk', name: '云对讲' },
  { value: 'ParkSpace', name: '云监控' },
]

export const iconList = [
  {
    name: 'icon1',
    url: require('../assets/img/icon1.png'),
  },
  {
    name: 'icon2',
    url: require('../assets/img/icon2.png'),
  },
  {
    name: 'icon3',
    url: require('../assets/img/icon3.png'),
  },
  {
    name: 'light',
    url: require('../assets/img/icon4.png'),
  },
  {
    name: 'icon5',
    url: require('../assets/img/icon5.png'),
  },
  {
    name: 'icon6',
    url: require('../assets/img/icon6.png'),
  },
]
