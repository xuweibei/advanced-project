import React from 'react'
import { PaginationConfig, SorterResult, TableCurrentDataSource } from 'antd/lib/table'

export interface StandardTableProps {
  columns: any
  onSelectRow?: (row: any) => void
  data: any
  rowKey?: any
  selectedRows?: any[]
  onChange?: (
    pagination: PaginationConfig,
    filters: Record<keyof any, string[]>,
    sorter: SorterResult<any>,
    extra?: TableCurrentDataSource<any>
  ) => void
  loading?: boolean
  showPagination: boolean
}

export default class StandardTable extends React.Component<StandardTableProps, any> {}
