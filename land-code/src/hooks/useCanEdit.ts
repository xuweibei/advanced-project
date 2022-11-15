import { useModel } from 'umi'
import { havePermission } from '@/utils/utils'

const useCanEdit = () => {

    const { initialState, loading } = useModel('@@initialState')
    const currentUser = initialState?.currentUser
  const pathname = location.pathname
  const permission = currentUser && havePermission(currentUser.permissions, pathname)

  return permission && permission.operation.startsWith('1')
}

export default useCanEdit
