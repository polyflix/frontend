import { ServerState, ServerStateAction } from "../../types/serverState.type";

const initialState: ServerState = ServerState.ONLINE;

export const serverStateReducer = (
  state: ServerState = initialState,
  action: ServerStateAction
): ServerState => {
  switch (action.type) {
    case ServerState.OFFLINE:
      return ServerState.OFFLINE;
    case ServerState.ONLINE:
      return ServerState.ONLINE;
    default:
      return state;
  }
};
