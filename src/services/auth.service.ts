import { StatusCodes } from "http-status-codes";
import { Dispatch } from "redux";
import { Token } from "../models/token.model";
import User from "../models/user.model";
import {
  LoginFailureAction,
  LoginInProgressAction,
  LoginSuccessAction,
  LogoutAction,
  RefreshAuthFailureAction,
  RefreshAuthInProgress,
  RefreshAuthSuccessAction,
  RegisterFailureAction,
  RegisterInProgressAction,
  RegisterSuccessAction,
} from "../redux/actions/auth.action";
import { AuthAction, ILoginForm, IRegisterForm } from "../types/auth.type";
import { GET, POST } from "../utils/api.util";

export class AuthService {
  /**
   * Login a user
   * @param {ILoginForm} loginForm
   */
  static login(loginForm: ILoginForm) {
    return async function (dispatch: Dispatch<AuthAction>) {
      dispatch(LoginInProgressAction());

      const { status, response, error } = await POST("/auth/login", {
        body: loginForm,
      });

      if (![StatusCodes.OK, StatusCodes.CREATED].includes(status)) {
        return dispatch(LoginFailureAction(error));
      }

      const { user, accessToken } = response;

      const token = Token.decode(accessToken);

      return dispatch(LoginSuccessAction(User.fromJson(user), token));
    };
  }

  /**
   * Refresh authentication
   * @param {Dispatch<AuthAction>} dispatch the dispatcher
   */
  static refreshAuth() {
    return async function (dispatch: Dispatch<AuthAction>) {
      dispatch(RefreshAuthInProgress());
      const { status, response } = await POST("/auth/refresh");
      if (
        status !== StatusCodes.OK ||
        (status === StatusCodes.OK && !response.user)
      ) {
        return dispatch(RefreshAuthFailureAction());
      }
      const token = Token.decode(response.token);

      return dispatch(
        RefreshAuthSuccessAction(User.fromJson(response.user), token)
      );
    };
  }

  /**
   * Log out the user
   */
  static logout() {
    return async function (dispatch: Dispatch<AuthAction>) {
      await GET("/auth/logout");
      return dispatch(LogoutAction());
    };
  }

  /**
   * Register a user
   * @param {IRegisterForm} registerForm
   */
  static register(registerForm: IRegisterForm) {
    return async function (dispatch: Dispatch<AuthAction>) {
      let action = RegisterInProgressAction();
      dispatch(action);

      const { status, response, error } = await POST("/auth/register", {
        body: registerForm,
      });

      if (![StatusCodes.OK, StatusCodes.CREATED].includes(status))
        action = RegisterFailureAction(error);
      else {
        const { user, accessToken } = response;
        const token = Token.decode(accessToken);

        action = RegisterSuccessAction(User.fromJson(user), token);
      }
      return dispatch(action);
    };
  }
}
