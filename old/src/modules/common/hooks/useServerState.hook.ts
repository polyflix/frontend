import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../../common/redux/reducers/root.reducer";
import { ServerState } from "../types/serverState.type";

/**
 * Custom hook for retrieving AuthState from Redux.
 * @returns {AuthState} the current AuthState
 */
export const useServerState = (): ServerState => {
  return useSelector((state: RootState) => state.serverState, shallowEqual);
};
