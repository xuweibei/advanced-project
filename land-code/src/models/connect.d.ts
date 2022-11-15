import { Loading } from 'umi'
import { ParkingModelState } from './parking'
import { RegionModelState } from './region'
import { AccountModelState } from './account'
import { BuildingModelState } from './building'
import { RoleModelState } from './role'
import { EngineeringLogModelState } from './engineeringLog'
import { SmartHostModelState } from './smartHost'
import { ProjectModelState } from './project'
import { HostModelState } from './host'
import { UserModelState } from './user'

export interface ConnectState {
  building: BuildingModelState
  parking: ParkingModelState
  loading: Loading
  region: RegionModelState
  account: AccountModelState
  role: RoleModelState
  engineeringLog: EngineeringLogModelState
  smartHost: SmartHostModelState
  project: ProjectModelState
  host: HostModelState
  user: UserModelState
}
