import { GenericAction } from './generic.type'

export enum ServerState {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
}

export type ServerStateAction = GenericAction<ServerState>
