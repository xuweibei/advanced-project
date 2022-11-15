import React, { PureComponent } from 'react'
import { Cascader } from 'antd'

import { getProvinces, getCityById, getareasById } from '@/services/api'

class CascaderSelect extends PureComponent {
  constructor(props: any) {
    super(props)
    this.state = {
      options: [],
    }
  }
  async componentDidMount() {
    let provincesList = await getProvinces()
    this.dataList(provincesList)
  }
  dataList = (dataList: any) => {
    let options = dataList.map((item: any) => {
      return {
        value: item.provinceid,
        label: item.province,
        isLeaf: false,
      }
    })
    this.setState({
      options,
    })
  }

  loadData = async (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    let cityOptions = {}
    if (selectedOptions.length === 1) {
      let cityList = await getCityById(targetOption.value)
      cityOptions = cityList.map((item: any) => {
        return {
          value: parseInt(item.cityid),
          label: item.city,
          isLeaf: false,
        }
      })
    } else {
      let areaList = await getareasById(targetOption.value)
      cityOptions = areaList.map((item: any) => {
        return {
          value: parseInt(item.areaid),
          label: item.area,
        }
      })
    }

    setTimeout(() => {
      targetOption.loading = false
      targetOption.children = cityOptions
      this.setState({
        options: [...this.state.options],
      })
    }, 1000)
  }
  render() {
    const { options } = this.state
    return <Cascader options={options} loadData={this.loadData} changeOnSelect {...this.props} />
  }
}
export default CascaderSelect
