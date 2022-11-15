declare namespace API {
  export interface CurrentUser {
    id: number
    developerId: number
    mobile: string
    name: string
    roleId: number
    username: string
    avatar: string
    permissions: Permission[]
  }

  export interface Permission {
    id: number
    path: string
    name: string
    pid: number
    hideInMenu?: boolean
    disabled?: boolean
    sort: number
    icon: any
    operation: string
    isLeafNode: boolean
    component: boolean
  }
}
