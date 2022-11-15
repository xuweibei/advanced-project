import React, { PureComponent, useState, useEffect, useCallback, FC } from 'react'
import { Button, List, Card, message, Popconfirm } from 'antd'
import { connect } from 'dva'
import { history } from 'umi'
import useCanEdit from '@/hooks/useCanEdit'
import styles from './News.less'
import { queryNews, removeNews, setToppingStatus, setShelvesTimeStatus } from '@/services/api'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const ListItem = List.Item

const News: FC<any> = props => {
  const canEdit = useCanEdit()
  const [allNews, setAllNews] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 8 })
  const [total, setTotal] = useState<number>()
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)

  useEffect(() => {
    queryNews(pagination)
      .then(res => {
        setTotal(res.count)
        setAllNews(res.results)
        setLoadingStatus(false)
      })
      .catch(e => {
        console.log('获取新闻失败', e)
        setLoadingStatus(false)
      })
  }, [pagination])

  const onPaginationChange = async (pages: number) => {
    setPagination({ page: pages, ...pagination })
  }

  const removeNewsRecord = async (id: any) => {
    await removeNews(id)
      .then(res => {
        message.success('删除成功！', 3)
        setPagination({ ...pagination })
      })
      .catch(e => {
        console.log(e, '删除失败')
      })
  }
  const toppingSet = async (item: any) => {
    await setToppingStatus(item.id)
      .then(res => {
        message.success('操作成功！', 3)
        setPagination({ ...pagination })
      })
      .catch(e => {
        console.log(e, '置顶失败')
      })
  }
  const shelvesSet = async (item: any) => {
    await setShelvesTimeStatus(item.id)
      .then(res => {
        message.success('操作成功！', 3)
        setPagination({ ...pagination })
      })
      .catch(e => {
        console.log(e, '上线失败')
      })
  }

  const onCreate = () => {
    history.push('/information-delivery/material/list/0')
  }

  const renderItem = (item: any, canEdit: any) => {
    return (
      <ListItem>
        <Card>
          <section className={styles.news}>
            <div>
              <h1>{item.title}</h1>
            </div>
            <div
              style={{ backgroundImage: `url(${item.picture})` }}
              className={styles.newsImg}
            ></div>
            {canEdit && (
              <div className={styles.btnWrapper}>
                <Button onClick={() => shelvesSet(item)}>
                  {item.shelvesTime ? '下线' : '上线'}
                </Button>
                {item.shelvesTime && (
                  <Button onClick={() => toppingSet(item)}>
                    {item.toppingTime ? '取消置顶' : '置顶'}
                  </Button>
                )}
                <Button
                  type="primary"
                  onClick={() => history.push(`/information-delivery/material/list/${item.id}`)}
                >
                  修改
                </Button>
                <Popconfirm
                  title={'是否确认删除？'}
                  onConfirm={() => removeNewsRecord(item.id)}
                  okText="是"
                  cancelText="否"
                >
                  <Button>删除</Button>
                </Popconfirm>
              </div>
            )}
          </section>
        </Card>
      </ListItem>
    )
  }

  return (
    <div>
      {canEdit && (
        <p>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            新增素材
          </Button>
        </p>
      )}
      <List
        loading={loadingStatus}
        dataSource={allNews}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        pagination={{
          ...pagination,
          total,
          onChange: page => {
            onPaginationChange(page)
          },
        }}
        renderItem={item => renderItem(item, canEdit)}
      />
    </div>
  )
}

export default connect(({ news, loading, user }: any) => ({
  news,
}))(News)
