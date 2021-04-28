import { AuthAction, AuthState } from "../../types/auth.type";
import { AuthActions } from "../actions/auth.action";

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  token: null,
  authError: null,
};

/**
 * Authentication state reducer
 * @param {AuthState} state the actual state
 * @param {AuthAction} action the action to dispatch
 * @returns {AuthState} the state updated
 */
const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.REGISTER_SUCCESS:
    case AuthActions.REFRESH_AUTH_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      };

    case AuthActions.LOGIN_IN_PROGRESS:
    case AuthActions.REGISTER_IN_PROGRESS:
      return {
        ...state,
        authError: null,
        isLoading: true,
      };

    case AuthActions.LOGIN_FAILURE:
    case AuthActions.REGISTER_FAILURE:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthenticated: false,
      };
    case AuthActions.LOGOUT:
    case AuthActions.REFRESH_AUTH_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export default authReducer;
