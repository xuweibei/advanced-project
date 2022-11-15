import { useState, useCallback } from 'react'

type fun = (...args: any) => Promise<any>

const useApiLoading = (apiFun: fun) => {
  const [loading, setLoading] = useState(false)

  const apiFunWrapper = useCallback(
    async (...args: any) => {
      setLoading(true)
      try {
        return await apiFun(...args)
      } catch (err) {
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFun]
  )

  return { api: apiFunWrapper, loading }
}

export default useApiLoading
