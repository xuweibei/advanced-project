import { Button, Card, message, Modal, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'umi'
import styles from '../technologyCard/index.less'
import { iconList } from '@/utils/utils'
const TechnologyCard = (props: any) => {
  const { img, title, icon, isLight, number, childNumber, id, companyId, delItem } = props
  const [visible, setVisible] = useState(false)
  const [decideDelete, setDecideDelete] = useState(false)
  const [icons, setIcons] = useState<any>()

  useEffect(() => {
    iconList.map(item => {
      if (item.name == icon) {
        setIcons(item.url)
      }
    })
  }, [])

  const DeleteModal = () => {
    return (
      <>
        <Modal
          title="警告"
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={() => {
            setDecideDelete(true), setVisible(false)
          }}
          okText="删除"
        >
          <div>删除后，该大工艺类型下所有类型均会一起删除！</div>
        </Modal>
      </>
    )
  }
  const handleSubmit = () => {
    delItem(id)
    setDecideDelete(false)
    setVisible(false)
  }
  const DecideModal = () => {
    return (
      <>
        <Modal
          visible={decideDelete}
          onCancel={() => setDecideDelete(false)}
          onOk={() => handleSubmit()}
        >
          确认要删除该大工艺和它包含的所有子工艺内容？
        </Modal>
      </>
    )
  }
  const deleteItem = () => {
    setVisible(true)
  }

  return (
    <>
      <DeleteModal />
      <DecideModal />
      <div className={styles.container}>
        {!isLight && (
          <Button onClick={() => deleteItem()} danger type="primary" className={styles.del_btn}>
            删除
          </Button>
        )}
        <img className={styles.img} src={img} />
        <div className={styles.content}>
          <div className={styles.title}>
            {isLight ? (
              <img className={styles.icon} src={icon} />
            ) : (
              <img className={styles.icon} src={icons} />
            )}
            <div>{title}</div>
          </div>
          {isLight ? (
            <div className={styles.detail}>
              <div>
                <div className={styles.childTitle}>工艺内容</div>
                <div className={styles.childNumber}>{number}</div>
              </div>
            </div>
          ) : (
            <div className={styles.detail}>
              <div className={styles.child}>
                <div className={styles.childTitle}>子工艺</div>
                <div className={styles.childNumber}>{number}</div>
              </div>
              <div>
                <div className={styles.childTitle}>工艺内容</div>
                <div className={styles.childNumber}>{childNumber}</div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.operate}>
          {isLight ? (
            <>
              <a
                style={{ width: '50%' }}
                href={`/construction-site/technologyManagement/highLightEdit`}
                target="_self"
              >
                <Button style={{ width: '100%', fontSize: '0.7813vw' }} type="text">
                  编辑
                </Button>
              </a>
              <a
                style={{ width: '50%' }}
                href={`/construction-site/technologyManagement/highLightManage/${companyId}/${id}`}
                target="_self"
              >
                <Button style={{ width: '100%', fontSize: '0.7813vw' }} type="text">
                  工艺内容管理
                </Button>
              </a>
            </>
          ) : (
            <>
              <a
                style={{ width: '50%' }}
                href={`/construction-site/technologyManagement/edit/${companyId}/${id}`}
                target="_self"
              >
                <Button style={{ width: '100%', fontSize: '0.7813vw' }} type="text">
                  编辑
                </Button>
              </a>
              {/* <Link
                style={{ width: '50%' }}
                to={{
                  pathname: `/construction-site/technologyManagement/edit`,
                  state: { companyId: companyId, technologyId: id },
                }}
              >
                <Button style={{ width: '100%', fontSize: '0.7813vw' }} type="text">
                  编辑
                </Button>
              </Link> */}

              <a
                style={{ width: '50%' }}
                href={`/construction-site/technologyManagement/technologyManage/${companyId}/${id}`}
                target="_self"
              >
                <Button style={{ width: '100%', fontSize: '0.7813vw' }} type="text">
                  工艺内容管理
                </Button>
              </a>
              {/* <Link
                style={{ width: '50%' }}
                to={{
                  pathname: `/construction-site/technologyManagement/technologyManage`,
                  state: { companyId: companyId, primaryTechnologyId: id },
                }}
              >
                <Button style={{ width: '100%', fontSize: '0.7813vw' }} type="text">
                  工艺内容管理
                </Button>
              </Link> */}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default TechnologyCard
