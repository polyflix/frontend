import { AuthAction, AuthState } from '../../types/auth.type'
import { AuthActions } from '../actions/auth.action'

const initialState: AuthState = {
  isLoading: true,
  hasRefresh: false,
  isAuthenticated: false,
  user: null,
  token: null,
  authError: null,
}

/**
 * Authentication state reducer
 * @param {AuthState} state the actual state
 * @param {AuthAction} action the action to dispatch
 * @returns {AuthState} the state updated
 */
export const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AuthActions.LOGIN_SUCCESS:
    case AuthActions.REGISTER_SUCCESS:
    case AuthActions.REFRESH_AUTH_SUCCESS:
    case AuthActions.UPDATE_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      };
    case AuthActions.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        authError: null,
      };
    case AuthActions.LOGIN_IN_PROGRESS:
    case AuthActions.REGISTER_IN_PROGRESS:
    case AuthActions.RESET_PASSWORD_IN_PROGRESS:
      return {
        ...state,
        authError: null,
        isLoading: true,
      }
    case AuthActions.REFRESH_AUTH_IN_PROGRESS:
      return {
        ...state,
        authError: null,
        isLoading: true,
        hasRefresh: true,
      }
    case AuthActions.LOGIN_FAILURE:
    case AuthActions.REGISTER_FAILURE:
    case AuthActions.REFRESH_AUTH_FAILURE:
    case AuthActions.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthenticated: false,
      }
    case AuthActions.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      }
    case AuthActions.UPDATE_USER_FAILURE:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
    case AuthActions.VALIDATE_ACCOUNT:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state
  }
}
