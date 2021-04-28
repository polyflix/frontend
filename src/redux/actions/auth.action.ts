import { Token } from "../../models/token.model";
import User from "../../models/user.model";
import { AuthAction, AuthState } from "../../types/auth.type";
import { actionFactory } from "../action.factory";

/**
 * AuthActions enumeration.
 */
export enum AuthActions {
  LOGOUT = "LOGOUT",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_IN_PROGRESS = "LOGIN_IN_PROGRESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_IN_PROGRESS = "REGISTER_IN_PROGRESS",
  REGISTER_FAILURE = "REGISTER_FAILURE",
  REFRESH_AUTH_SUCCESS = "REFRESH_AUTH_SUCCESS",
  REFRESH_AUTH_FAILURE = "REFRESH_AUTH_FAILURE",
}

/**
 * Create a login success action
 * @param {User} user the user logged in
 * @param {Token} token the access token
 * @returns {AuthAction} the login success action
 */
export const LoginSuccessAction = (user: User, token: Token): AuthAction => {
  return actionFactory<AuthState>(AuthActions.LOGIN_SUCCESS, {
    user,
    token,
  });
};

/**
 * Create a login in progress action
 * @returns {AuthAction} the login in progress action
 */
export const LoginInProgressAction = (): AuthAction => {
  return actionFactory<AuthState>(AuthActions.LOGIN_IN_PROGRESS);
};

/**
 * Create a login failure action
 * @param {string} error the auth error
 * @returns {AuthActions} the login failure action
 */
export const LoginFailureAction = (error: string): AuthAction => {
  return actionFactory<AuthState>(AuthActions.LOGIN_FAILURE, {
    authError: error,
  });
};

/**
 * Create a register in progress action
 * @returns {AuthAction} the register in progress action
 */
export const RegisterInProgressAction = (): AuthAction => {
  return actionFactory<AuthState>(AuthActions.REGISTER_IN_PROGRESS);
};

/**
 * Create the register success action
 * @param {User} user the user logged in
 * @param {Token} token the access token
 * @returns {AuthAction} the register success action
 */
export const RegisterSuccessAction = (user: User, token: Token): AuthAction => {
  return actionFactory<AuthState>(AuthActions.REGISTER_SUCCESS, {
    user,
    token,
  });
};

/**
 * Create the register failure action
 * @param {string} error the auth error
 * @returns {AuthAction} the register failure action
 */
export const RegisterFailureAction = (error: string): AuthAction => {
  return actionFactory<AuthState>(AuthActions.REGISTER_FAILURE, {
    authError: error,
  });
};

/**
 * Create the logout action
 * @returns {AuthAction} the log out action
 */
export const LogoutAction = (): AuthAction => {
  return actionFactory<AuthState>(AuthActions.LOGOUT);
};

/**
 * Create the refresh auth action
 * @param {User} user the user logged in
 * @param {Token} token the access token
 * @returns {AuthAction} the refresh auth success action
 */
export const RefreshAuthSuccessAction = (
  user: User,
  token: Token
): AuthAction => {
  return actionFactory<AuthState>(AuthActions.REFRESH_AUTH_SUCCESS, {
    user,
    token,
  });
};

/**
 * Create the refresh auth failure action
 * @returns {AuthAction} the refresh auth failure action
 */
export const RefreshAuthFailureAction = (): AuthAction => {
  return actionFactory<AuthState>(AuthActions.REFRESH_AUTH_FAILURE);
};
