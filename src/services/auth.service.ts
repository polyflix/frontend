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
  RefreshAuthSuccessAction,
  RegisterFailureAction,
  RegisterInProgressAction,
  RegisterSuccessAction,
} from "../redux/actions/auth.action";
import { AuthAction, ILoginForm, IRegisterForm } from "../types/auth.type";
import { GET, POST } from "../utils/api.util";
import { TimerService } from "./timer.service";

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
      TimerService.start(() => {
        AuthService.refreshAuth(dispatch);
      }, token.getExpirationInMillis());

      return dispatch(LoginSuccessAction(User.fromJson(user), token));
    };
  }

  /**
   * Refresh authentication
   * @param {Dispatch<AuthAction>} dispatch the dispatcher
   * @returns {AuthAction} the action dispatched
   */
  static async refreshAuth(dispatch: Dispatch<AuthAction>) {
    const { status, response } = await POST("/auth/refresh");
    if (
      status !== StatusCodes.OK ||
      (status === StatusCodes.OK && !response.user)
    ) {
      return dispatch(RefreshAuthFailureAction());
    }
    const token = Token.decode(response.token);
    TimerService.start(() => {
      AuthService.refreshAuth(dispatch);
    }, token.getExpirationInMillis());
    return dispatch(
      RefreshAuthSuccessAction(User.fromJson(response.user), token)
    );
  }

  /**
   * Log out the user
   */
  static logout() {
    return async function (dispatch: Dispatch<AuthAction>) {
      await GET("/auth/logout");
      // Stop the timer for refresh when user sign out
      TimerService.stop();
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
        TimerService.start(() => {
          AuthService.refreshAuth(dispatch);
        }, token.getExpirationInMillis());
        action = RegisterSuccessAction(User.fromJson(user), token);
      }
      return dispatch(action);
    };
  }
}
