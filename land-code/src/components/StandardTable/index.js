import React, { PureComponent } from 'react'
import { Table } from 'antd'

import styles from './index.less'

class StandardTable extends PureComponent {
  handleRowSelectChange = (selectedRowKeys) => {
    const { onSelectRow } = this.props
    onSelectRow && onSelectRow(selectedRowKeys)
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(pagination, filters, sorter)
    }
    let query = {
      pageIndex: pagination.current,
      pageCount: pagination.pageCount,
      ...filters
    }
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([])
  }

  render() {
    const { data = {}, rowKey, selectedRowKeys, showPagination = true, ...rest } = this.props
    const { list = [], pagination } = data

    const paginationProps = showPagination && {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination
    }

    const rowSelection = selectedRowKeys && {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled
      })
    }

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    )
  }
}

export default StandardTable
