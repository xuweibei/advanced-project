import React, { CSSProperties, memo, useState } from 'react'
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc'
import './pictureGrid.css'
import { UploadFile } from 'antd/es/upload/interface'
import { UploadChangeParam } from 'antd/lib/upload'
import { imagePreview } from '../../utils/pictureUtil'
import UploadList from 'antd/es/upload/UploadList'
import { Modal, Upload, message } from 'antd'
import { Props, SortableItemParams, SortableListParams } from './types'

const itemStyle: CSSProperties = {
  width: 104,
  height: 104,
  marginRight: 8,
  cursor: 'grab',
}
const SortableItem = SortableElement((params: SortableItemParams) => (
  
  <div style={itemStyle}>
    <UploadList
      locale={{ previewFile: '预览图片', removeFile: '删除图片' }}
      showDownloadIcon={false}
      listType={params.props.listType}
      onPreview={params.onPreview}
      onRemove={params.onRemove}
      items={[params.item]}
    />
  </div>
))

const beforeUpload = (file: UploadFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('需上传jpg、png格式图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片单张＜2MB!')
  }
  return isJpgOrPng && isLt2M
}

const listStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  maxWidth: '100%',
}
const SortableList = SortableContainer((params: SortableListParams) => {
  return (
    <div style={listStyle}>
      {params.items.map((item, index) => (
        <SortableItem
          key={`${item.uid}`}
          index={index}
          item={item}
          props={params.props}
          onPreview={params.onPreview}
          onRemove={params.onRemove}
        />
      ))}

      <div         style={{width:'104px'}}
>
      <Upload
        {...params.props}
        showUploadList={false}
        //beforeUpload={beforeUpload}
        onChange={params.onChange}
      >
        {params.props.children}
      </Upload>
      </div>
      
    </div>
  )
})

const PicturesGrid: React.FC<Props> = memo(({ onChange: onFileChange, ...props }) => {
  const [previewImage, setPreviewImage] = useState('')
  const fileList = props.fileList || []
  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    onFileChange({ fileList: arrayMove(fileList, oldIndex, newIndex) })
  }

  const checkImg = (file: UploadFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('需上传jpg、png格式图片!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片单张＜2MB!')
    }
    return isJpgOrPng && isLt2M //返回true表示图片符合要求
  }

  const onChange = ({ fileList: newFileList }: UploadChangeParam) => {
    const newFileList1 = newFileList.filter(
      item =>
        (item.type !== 'image/jpeg' && item.type !== 'image/png') || item.size / 1024 / 1024 < 2
    )
    if (newFileList1.length !== newFileList.length) {
      message.error('图片格式或大小不符合要求!')
    }
    onFileChange({ fileList: newFileList1 })
  }

  const onRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid)
    onFileChange({ fileList: newFileList })
  }

  const onPreview = async (file: UploadFile) => {
    await imagePreview(file, ({ image }) => {
      setPreviewImage(image)
    })
  }

  return (
    <>
      <SortableList
        // 当移动 1 之后再触发排序事件，默认是0，会导致无法触发图片的预览和删除事件
        distance={1}
        items={fileList}
        onSortEnd={onSortEnd}
        axis="xy"
        helperClass="SortableHelper"
        props={props}
        onChange={onChange}
        onRemove={onRemove}
        onPreview={onPreview}
      />
      <Modal
        visible={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage('')}
        bodyStyle={{ padding: 0 }}
      >
        <img style={{ width: '100%' }} alt="" src={previewImage} />
      </Modal>
    </>
  )
})

export { PicturesGrid }
