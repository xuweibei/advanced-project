import React, { useState, useEffect } from 'react'
import styles from './index.less'
const Modal = (props: any) => {
  const { children, isOpenModal, style, close } = props
  const handleClose = () => {
    close && close()
  }
  return isOpenModal ? (
    <>
      <div className={styles.container} style={{ ...style }}>
        <div className={styles.detailContent}>
          {children}
          <div className={styles.mask} onClick={handleClose}>
            <img src={require('../../assets/images/close.png')} />
          </div>
        </div>
      </div>
    </>
  ) : null
}
export default Modal
