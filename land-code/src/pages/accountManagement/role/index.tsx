/* eslint-disable */
import React, { useState, useEffect, useCallback, FC } from 'react'
import { Card, Button, Divider, Form, Modal, Input, TreeSelect, Select, message } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { connect, ConnectProps, Dispatch, useModel, useIntl } from 'umi'
import { PlusOutlined } from '@ant-design/icons'

import StandardTable from '@/components/StandardTable'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import { getUserPermissionsByUserId, getUserTreePermission } from '@/services/api'
import { ConnectState } from '@/models/connect'
import useCanEdit from '@/hooks/useCanEdit'
import useLocation from '@/hooks/useLocation'
import { removeRole } from '@/services/api'

interface RoleProps extends ConnectProps {
  dispatch: Dispatch
  form: any
  account: any
  role: any
  loading: any
  user: any
  roles: any
  permissions: any
  route: any
}

const FormItem = Form.Item
const Option = Select.Option

// 把用户角色数据转换成树形数据
const permissionToTreeData = (permissions: any) => {
  const treeData: string[] = []
  permissions.forEach((item: any) => {
    const { id, operation } = item
    if (item.pid !== 0 || !item.children) {
      if (operation.split('')[0] === '1') {
        treeData.push(`c-${id}-edit`)
      }
      if (operation.split('')[1] === '1') {
        treeData.push(`c-${id}-view`)
      }
    }
  })
  return treeData
}

const RoleForm = (props: any) => {
  const {
    data,
    visible,
    handleSubmit,
    setModalVisible,
    userPermissions, // 当前登录的用户的全新啊
  } = props
  const intl = useIntl()
  const [form] = Form.useForm()

  const {
    data: location,
    setData: setLocation,
    regions,
    setArea,
    setCity,
    setBuilding,
    cityOptions,
    buildingOptions,
  } = useLocation()

  useEffect(() => {
    form.setFieldsValue({
      regionIds: location[0] ? location[0] : [],
      cityIds: location[1] ? location[1] : [],
      buildingIds: location[2] ? location[2] : [],
    })
  }, [location])

  useEffect(() => {
    if (data) {
      setLocation([data.regionIds, data.cityIds, data.buildingIds])
    }
    form.resetFields()
  }, [data])

  const okHandle = () => {
    form
      .validateFields()
      .then((fieldsValue: any) => {
        setModalVisible(false)
        handleSubmit(fieldsValue)
        form.resetFields()
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  const getTreeData = (userPermissions: any): any => {
    if (!userPermissions || !userPermissions.length) {
      return []
    }
    const Permissions = userPermissions.filter((item: any) => item.common !== true)
    const parents: any = {}

    Permissions.forEach((item: any) => {
      const { id, name, pid } = item

      if (pid === 0) {
        // 父菜单
        parents[id] = parents[id] || {
          name,
          key: `p-${id}`,
          value: `p-${id}`,
          children: [],
        }
      } else {
        if (!parents[pid]) {
          const parent = Permissions.find((item: any) => item.id === parents[id])
          parents[pid] = {
            name: parent && parent.name,
            key: `p-${pid}`,
            value: `p-${pid}`,
            children: [],
          }
        }
        // 子菜单，将子菜单加入到父菜单中，如果遍历时还没有相应的父菜单，则先创建父级菜单
        parents[pid].children.push({
          name,
          key: `c-${id}`,
          value: `c-${id}`,
          children: [
            {
              title: '操作',
              key: `c-${id}-edit`,
              value: `c-${id}-edit`,
            },
            {
              title: '查看',
              key: `c-${id}-view`,
              value: `c-${id}-view`,
            },
          ],
        })
      }
    })

    const treeData = Object.values(parents)
    treeData.forEach((parent: any) => {
      parent.title = intl.formatMessage({ id: `menu.${parent.name}` })
      if (parent.children.length) {
        parent.children.forEach(
          (item: any) =>
            (item.title = intl.formatMessage({
              id: `menu.${parent.name}.${item.name}`,
            }))
        )
      } else {
        // 如果一级菜单下面没有子菜单，则认为一级菜单为叶子节点，可以直接配置权限
        const id = parent.key.split('-')[1]
        parent.children = [
          {
            title: '操作',
            key: `c-${id}-edit`,
            value: `c-${id}-edit`,
          },
          {
            title: '查看',
            key: `c-${id}-view`,
            value: `c-${id}-view`,
          },
        ]
      }
    })

    return treeData
  }

  const onCancel = () => {
    form.resetFields()
    setModalVisible(false)
  }

  return (
    <Modal
      title={`${data ? '修改' : '添加'}角色`}
      visible={visible}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Form form={form} initialValues={data} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
        <FormItem
          label="角色名称"
          name="name"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input />
        </FormItem>
        <FormItem label="区域" name="regionIds" rules={[{ required: true, message: '请配置区域' }]}>
          <Select allowClear mode="multiple" maxTagCount={3} onChange={v => setArea(v)}>
            {regions &&
              regions.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem label="城市" name="cityIds" rules={[{ required: true, message: '请配置城市' }]}>
          <Select allowClear mode="multiple" maxTagCount={2} onChange={v => setCity(v)}>
            {cityOptions &&
              cityOptions.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem
          label="社区"
          name="buildingIds"
          rules={[{ required: true, message: '请配置社区' }]}
        >
          <Select allowClear mode="multiple" maxTagCount={2} onChange={v => setBuilding(v)}>
            {buildingOptions &&
              buildingOptions.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem
          label="权限配置"
          name="permissions"
          rules={[{ required: true, message: '请配置权限' }]}
        >
          <TreeSelect
            style={{ width: '100%' }}
            treeCheckable
            treeData={getTreeData(userPermissions)}
            maxTagCount={0}
          />
        </FormItem>
      </Form>
    </Modal>
  )
}

const Role: FC<RoleProps> = props => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [currentRole, setCurrentRole] = useState<any>()
  const [allRegion, setAllRegion] = useState<any>()
  // const {
  //   masterState: { currentUser = {} },
  // } = useModel('@@qiankunStateFromMaster')
  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const canEdit = useCanEdit()
  const { dispatch, role, loading } = props

  useEffect(() => {
    const initTreeData = async () => {
      const developerId = localStorage.getItem('developerId')
      const res = await getUserTreePermission({ developerId })
      setAllRegion(res.regions)
    }

    dispatch({
      type: 'role/fetch',
    })
    initTreeData()
  }, [])

  const onCreateRole = () => {
    setModalVisible(true)
    setCurrentRole(null)
  }

  const onUpdateRole = async (role: any) => {
    const hideLoading = message.loading('加载中')
    try {
      let permissions = await getUserPermissionsByUserId(role.id)
      permissions = permissions.filter((item: any) => item.common !== true)
      permissions.forEach((item: any) => {
        permissions.forEach((ele: any) => {
          if (item.id === ele.pid) {
            item.children = true
          }
        })
      })

      setModalVisible(true)
      setCurrentRole({
        ...role,
        permissions: permissionToTreeData(permissions),
      })
    } finally {
      hideLoading()
    }
  }

  // 删除
  const onRemove = (record: any) => {
    removeRole(record.id)
      .then(res => {
        message.success('删除成功')
        dispatch({
          type: 'role/fetch',
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  const handleSubmit = async (values: any) => {
    const { permissions } = values

    const obj: any = {}
    permissions.forEach((permission: string) => {
      const [, id, p] = permission.split('-') // [c,id,edit|view]
      obj[id] = obj[id] || { edit: '0', view: '1' }
      obj[id][p] = '1'

      // 把父级添加到权限中
      const permissionItem =
        currentUser && currentUser.permissions.find((item: any) => item.id === parseInt(id))
      if (permissionItem && permissionItem.pid) {
        obj[permissionItem.pid] = { edit: '0', view: '1' }
      }
    })
    const permissionOperations = Object.entries(obj).map(([k, v]: any) => {
      return {
        permissionId: parseInt(k, 10),
        operation: v.edit + v.view,
      }
    })

    let reg: any = []
    allRegion.forEach((item: any) => {
      if (values.regionIds.includes(item.id)) {
        const region = { ...item, cities: [] }
        item.cities.forEach((city: any) => {
          if (values.cityIds.includes(city.id)) {
            const newCity = { ...city, buildings: [] }
            region.cities.push(newCity)
            city.buildings.forEach((building: any) => {
              if (values.buildingIds.includes(building.id)) {
                newCity.buildings.push(building)
              }
            })
          }
        })
        reg.push(region)
      }
    })

    values = {
      name: values.name,
      regions: reg,
      permissionOperations,
      developerId: localStorage.getItem('developerId'),
    }
    if (currentRole) {
      // 修改
      try {
        await dispatch({
          type: 'role/update',
          payload: {
            id: currentRole.id,
            values,
          },
        })
        message.success('修改成功')
      } catch (err) {
        console.log(err)
      }
    } else {
      // 新建
      try {
        await dispatch({
          type: 'role/create',
          payload: values,
        })
        message.success('新建成功')
      } catch (err) {
        console.log(err)
      }
    }
    setModalVisible(false)
  }

  const getColumns = (): ColumnsType => {
    const columns: ColumnsType = [
      {
        title: '序号',
        dataIndex: 'id',
        render: (text: any, record: any, index: number) => index + 1,
      },
      {
        title: '用户角色',
        dataIndex: 'name',
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
      },
    ]
    if (canEdit) {
      columns.push({
        title: '操作',
        render: (text: any, record: any) =>
          !record.superRole ? (
            <>
              <a onClick={() => onUpdateRole(record)}>修改</a>
              <Divider type="vertical" />
              <TableDeleteBtn onDelete={() => onRemove(record)} />
            </>
          ) : (
            <></>
          ),
      })
    }
    return columns
  }

  return (
    <Card bordered={false}>
      {canEdit && (
        <div style={{ marginBottom: 20 }}>
          <Button type="primary" onClick={onCreateRole}>
            <PlusOutlined />
            新增角色
          </Button>
        </div>
      )}
      <StandardTable
        loading={loading}
        data={{ list: role && role.list }}
        columns={getColumns()}
        showPagination={false}
        rowKey={(record: any) => record.id}
      />
      <RoleForm
        data={currentRole}
        handleSubmit={handleSubmit}
        visible={modalVisible}
        setModalVisible={setModalVisible}
        userPermissions={currentUser && currentUser.permissions}
      />
    </Card>
  )
}
export default connect(({ role, loading }: ConnectState) => ({
  role: role,
  loading: loading.effects['role/fetch'],
}))(Role)
