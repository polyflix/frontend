import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../../common/redux/reducers/root.reducer";
import { AuthState } from "../types/auth.type";

/**
 * Custom hook for retrieving AuthState from Redux.
 * @returns {AuthState} the current AuthState
 */
export const useAuth = (): AuthState => {
  const state: AuthState = useSelector(
    (state: RootState) => state.auth,
    shallowEqual
  );
  return state;
};
