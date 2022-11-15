import { Loading } from 'umi'
import { ConsoleModelState } from './consoleData'

export interface ConnectState {
  consoleDatas: ConsoleModelState
  loading: Loading
}