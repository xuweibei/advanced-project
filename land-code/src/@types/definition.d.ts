/*
 * @Author: biu
 * @Date: 2020-03-20 10:18:57
 * @LastEditTime: 2021-02-20 11:12:31
 * @Description: TS 声明文件
 */
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.json'
declare module '*.js'

interface Window {
  SYS_SCENE: string
}

declare const SERVER_IP: string
declare const VERSION: string
declare const WEBSOCKET_URL: string
