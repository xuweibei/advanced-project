import React, { FC, useEffect, useState, useCallback } from 'react'
import {
  IndexModelState,
  ConnectProps,
  ConsoleModelState,
  Loading,
  connect,
  Dispatch,
  Link,
} from 'umi'
import { Card, Select, message, Input, Form, Popconfirm, Divider, Button, Modal } from 'antd'
import { getImportWorkList, delImportWork } from '@/services/api'
import FormContainer from '@/components/FormContainer'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'

const { Option } = Select
const FormItem = Form.Item

interface PageProps extends ConnectProps {
  dispatch: Dispatch
  consoleDatas: ConsoleModelState
  loading: boolean
}

const importantWorkManagement: FC<PageProps> = props => {
  //const { dispatch, loading } = props
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 10 })
  const [importentWorkList, setImportentWorkList] = useState<any>({})
  const [visible, setVisible] = useState<boolean>(false)
  const [currentImportantWork, setCurrentImportantWork] = useState<any>()
  const [buildingList, setBuildingList] = useState<any>([{ id: 0, name: '全部' }])
  //获取楼盘列表
  //   useEffect(() => {
  //     queryDeveloperRegions().then(res => {
  //       let DeveloprtList = [...developerUserList, ...res]
  //       setDeveloperUserList(DeveloprtList)
  //     })
  //   }, [])

  useEffect(() => {
    let data = {
      buildingId: 1,
      ...pagination,
    }
    getImportWorkList(data).then(res => {
      setImportentWorkList({
        list: res.results,
        pagination: {
          total: res.count,
          current: pagination.page,
          pageSize: pagination.pageSize,
        },
      })
    })
  }, [pagination])

  //删除项目
  const importantWorkDelete = (data: any) => {
    delImportWork(data.id)
      .then((res: any) => {
        message.success('删除成功')
        setPagination({ page: 1, pageSize: 10 })
      })
      .catch((e: any) => {
        message.error('删除失败', e)
      })
  }

  const handleImportantWorkModalVisible = (flag?: any, record?: any) => {
    setVisible(!!flag)
    setCurrentImportantWork(record ? record : null)
  }

  const handleTableChange = useCallback((pagination: any) => {
    setPagination({ page: pagination.current, pageSize: pagination.pageSize })
  }, [])

  const columns = [
    {
      title: '序号',
        dataIndex: 'id',
        render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: '标题',
      dataIndex: 'name',
      render: (text: any) => (text ? text : '--'),
    },
    // {
    //   title: '时间',
    //   dataIndex: 'time',
    //   render: (text: any) => (text ? text : '--'),
    // },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          <Link to={`/construction-site/importantWorkManagement/update/${record.id}`}>编辑</Link>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除此重要工作?"
            onConfirm={() => importantWorkDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <a className={styles.deleteText}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ]

  const renderForm = () => {
    return (
      <>
        <Select
          placeholder="选择楼盘"
          style={{ marginRight: 20 }}
          // onChange={onChangeCurrBuilding}
          // value={selectBuilding}
        >
          {buildingList &&
            buildingList.map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
        <Link to={`/construction-site/importantWorkManagement/create`}>
          <Button type="primary">新建图文</Button>
        </Link>
      </>
    )
  }

  return (
    <Card bordered={false}>
      <FormContainer>{renderForm()}</FormContainer>
      <StandardTable
        //loading={loading}
        showPagination={true}
        data={importentWorkList}
        columns={columns}
        rowKey={(record: any) => record.index}
        onChange={handleTableChange}
      />
    </Card>
  )
}

export default importantWorkManagement
