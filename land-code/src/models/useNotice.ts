import { useState } from 'react'

export default function useGetDeveloperIdModel() {
  const [noticeState, setNoticeState] = useState<boolean>(false)

  return {
    noticeState,
    setNoticeState,
  }
}
