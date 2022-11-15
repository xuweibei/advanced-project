import React, { useState } from 'react'
import { Button } from 'antd'
import styles from './index.less'

interface Props {
  style?: string
  layout?: string
  textStyle?: string
  textCheckStyle?: string
  value?: any
  options: { label: string; value: any }[]
  onChange?: (v: any) => void
}

const index = ({
  onChange,
  style,
  layout = 'horizontal',
  textStyle,
  textCheckStyle,
  value,
  options,
}: Props) => {
  const [curValue, setCurValue] = useState(value)

  const handleClick = (value: any) => {
    setCurValue(value)
    onChange && onChange(value)
  }

  let className = styles.main
  if (!style && layout === 'horizontal') {
    className = `${styles.horizontal}  ${styles.vertical}`
  }

  let radioTextCheckStyle = textCheckStyle ? textCheckStyle : styles.radioTextCheckStyle

  let radioTextnotCheckStyle = textStyle ? textStyle : styles.radioTextnotCheckStyle

  return (
    <div className={style ? style : className}>
      {options.map((item: any) => {
        const isSelected = item.value === curValue
        return (
          <Button
            type="text"
            className={styles.buttonText}
            onClick={() => handleClick(item.value)}
            key={item.value}
          >
            <span className={isSelected ? radioTextCheckStyle : radioTextnotCheckStyle}>
              {item.label}
              {isSelected ? item.checkicon && item.checkicon : item.icon && item.icon}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
export default index
