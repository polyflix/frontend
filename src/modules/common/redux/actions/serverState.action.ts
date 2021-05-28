import { actionFactory } from "../../factories";
import { ServerState, ServerStateAction } from "../../types/serverState.type";

export const serverStateOfflineAction = (): ServerStateAction =>
  actionFactory<ServerState>(ServerState.OFFLINE);

export const serverStateOnlineAction = (): ServerStateAction =>
  actionFactory<ServerState>(ServerState.ONLINE);
