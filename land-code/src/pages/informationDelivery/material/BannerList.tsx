import React, { PureComponent, useState, useEffect, useCallback, FC } from 'react'
import { Button, List, Card, message, Modal, Popconfirm } from 'antd'
import { connect } from 'dva'
import { history } from 'umi'
import useCanEdit from '@/hooks/useCanEdit'
import styles from './News.less'
import { queryBanners, removeBanner, sortBanner } from '@/services/api'
import { PlusOutlined, AlignLeftOutlined } from '@ant-design/icons'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'

const ListItem = List.Item

const SortableItem = SortableElement(({ value }: any) => (
  <li style={{ border: 'solid', borderWidth: 0.5, borderColor: '#E7E7E7', marginBottom: 5 }}>
    标题：{value.displayContent}
  </li>
))

const SortableList = SortableContainer(({ items }: any) => {
  return (
    <ul style={{ paddingLeft: 15, paddingRight: 15 }}>
      {items.map((value: any, index: number) => (
        <SortableItem key={index} index={index} value={value} />
      ))}
    </ul>
  )
})

const BannerList: FC<any> = props => {
  const canEdit = useCanEdit()
  const [allNews, setAllNews] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 8 })
  const [total, setTotal] = useState<number>()
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const [sortModal, setSortModal] = useState<boolean>(false)
  const [sortList, setSortList] = useState<any>()

  useEffect(() => {
    queryBanners(pagination)
      .then(res => {
        setTotal(res.total)
        setAllNews(res.list)
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
    await removeBanner(id)
      .then(res => {
        message.success('删除成功！', 3)
        setPagination({ ...pagination })
      })
      .catch(e => {
        console.log(e, '删除失败')
      })
  }

  const onCreate = () => {
    history.push('/information-delivery/banner/list/0')
  }

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setAllNews(arrayMove(allNews, oldIndex, newIndex))
  }
  const postSort = async () => {
    let sort: any[] = []
    allNews.forEach((news, index) => {
      let data = {
        ...news,
        sequence: index + 1,
      }
      sort.push(data)
    })
    await sortBanner(sort)
      .then(res => {
        message.success('编辑排序成功')
      })
      .catch(e => {
        message.error('编辑排序失败')
      })
  }

  const renderItem = (item: any, canEdit: any) => {
    return (
      <ListItem>
        <Card>
          <section className={styles.news}>
            <div>
              <h1>{item.displayContent}</h1>
            </div>
            <div
              style={{ backgroundImage: `url(${item.picUrl})` }}
              className={styles.newsImg}
            ></div>
            {canEdit && (
              <>
                <Button
                  type="primary"
                  style={{ marginRight: 10, marginTop: 5 }}
                  onClick={() => history.push(`/information-delivery/banner/list/${item.id}`)}
                >
                  修改
                </Button>
                {/* <Button
                  style={{ marginRight: 10, marginTop: 5 }}
                  onClick={() => removeNewsRecord(item)}>
                  删除
                </Button> */}
                <Popconfirm
                  title={'是否确认删除？'}
                  onConfirm={() => removeNewsRecord(item.id)}
                  okText="是"
                  cancelText="否"
                >
                  <Button>删除</Button>
                </Popconfirm>
              </>
            )}
          </section>
        </Card>
      </ListItem>
    )
  }

  return (
    <div>
      {canEdit && (
        <p style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button
            type="primary"
            danger
            style={{ marginRight: 10 }}
            onClick={() => setSortModal(true)}
          >
            排序
          </Button>
          {(!allNews || allNews.length < 8) && (
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              icon={<PlusOutlined />}
              onClick={onCreate}
            >
              新增素材
            </Button>
          )}
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
      <Modal visible={sortModal} onOk={postSort} onCancel={() => setSortModal(false)}>
        <SortableList items={allNews} onSortEnd={onSortEnd}></SortableList>
      </Modal>
    </div>
  )
}

export default BannerList
