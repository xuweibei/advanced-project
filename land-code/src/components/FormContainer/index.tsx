import React from 'react'

import styles from './index.less'

export default ({ children }: any) => {
  return <div className={styles.formContainer}>{children}</div>
}
