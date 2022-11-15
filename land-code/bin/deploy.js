#!/usr/bin/env node

/**
 * 此脚本用于打包页面并上传到服务器
 *
 * 使用方法：项目根目录下执行 node bin/deploy.js --env=dev -u root -p xxxx
 * Options:
 *   -u: 服务器账号，默认为 FEDAdmin
 *   -p: 服务器账号对应的密码
 *   -env: 构建环境
 *   -s: 跳过构建步骤
 *
 * 查看帮助：node bin/deploy.js -h
 */
const packageJSON = require('../package.json')
const { Command } = require('commander')
const SSH = require('simple-ssh')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const scpClient = require('scp2')
const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

const PROJECT_NAME = packageJSON.name
const ARCHIVE_NAME = 'archive.zip' // zip 压缩后的文件名
const REMOTE_PATH = `/home/FEDAdmin/www/${PROJECT_NAME}` // 服务器中静态资源文件目录

// 命令行参数
const program = new Command()
program
  .option('-u, --username <username>', '服务器用户名', 'FEDAdmin')
  .option('-p, --password <password>', '服务器密码')
  .option('-e, --env <env>', '构建环境', 'dev')
  .option('-s, --skip-build', '跳过构建步骤，直接打包')
program.parse(process.argv)
const opts = program.opts()

const username = opts.username
const env = opts.env
const host = env === 'prod' ? '60.205.159.179' : env === 'uat' ? '121.199.19.53' : '47.102.98.16'
const password = opts.password // 服务器密码 SSH 密码

// 生成压缩包
function generateZip() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.join(__dirname, '..', 'dist', ARCHIVE_NAME))
    const archive = archiver('zip', {
      zlib: {
        level: 9,
      },
    })

    output.on('close', function() {
      console.log('压缩完成')
      resolve()
    })
    archive.on('error', function(err) {
      reject(err)
    })

    archive.pipe(output)
    archive.directory('dist', false)

    archive.finalize()
  })
}

async function main() {
  let result

  console.log(`开始发布到 ${host}，环境：${env}`)

  console.log(`[1/5] 构建代码`)
  if (opts.skipBuild) {
    console.log('跳过构建阶段，使用当前已有的版本')
  } else {
    result = await exec(`npm run build:${env}`)
    console.log(result.stdout)
  }

  console.log('[2/5] 打包静态资源，生成 zip 包...')
  await generateZip()

  console.log('[3/5] 清理服务器目标目录')
  await clearTargetDir()

  console.log(`[4/5] 上传 zip 包到服务器:${host} ...`)
  await scp()

  console.log('[5/5] 开始远程解压...')
  await execRemoteOperations()
}

function scp() {
  return new Promise((resolve, reject) => {
    scpClient.scp(
      `dist/${ARCHIVE_NAME}`,
      {
        host,
        username: username,
        password: password,
        path: REMOTE_PATH,
      },
      function(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

function clearTargetDir() {
  return new Promise((resolve, reject) => {
    const ssh = new SSH({
      host,
      user: username,
      pass: password,
    })

    ssh
      .exec(`mkdir ${REMOTE_PATH}`, {
        out: stdout => console.log(stdout),
        exit: () => {
          resolve()
        },
      })
      .exec(`rm -rf ${REMOTE_PATH}/*`, {
        out: stdout => console.log(stdout),
        exit: () => {
          resolve()
        },
      })
      .on('error', function(err) {
        ssh.end()
        reject(err)
      })
      .start()
  })
}

function execRemoteOperations() {
  return new Promise((resolve, reject) => {
    const ssh = new SSH({
      host,
      user: username,
      pass: password,
    })

    ssh
      .exec(`unzip -o -d ${REMOTE_PATH} ${REMOTE_PATH}/${ARCHIVE_NAME}`, {
        out: stdout => console.log(stdout),
      })
      .exec(`rm ${REMOTE_PATH}/${ARCHIVE_NAME}`, {
        out: stdout => console.log(stdout),
        exit: () => {
          resolve()
        },
      })
      .on('error', function(err) {
        ssh.end()
        reject(err)
      })
      .start()
  })
}

main()
  .then(() => console.log('[Finished] 成功部署页面'))
  .catch(err => {
    console.error('部署页面出错：')
    console.error(err)
  })
