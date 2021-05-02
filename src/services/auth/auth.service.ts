import { HttpService } from "@core/services/http/http.service";
import { Injectable } from "@modules/di";
import { StatusCodes } from "http-status-codes";
import { Token } from "../../models/token.model";
import User from "../../models/user.model";
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
} from "../../redux/actions/auth.action";
import { AuthAction, ILoginForm, IRegisterForm } from "../../types/auth.type";
import { ReduxService } from "../redux/redux.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly reduxService: ReduxService<AuthAction>
  ) {}

  /**
   * Login a user
   * @param {ILoginForm} loginForm
   */
  public async login(loginForm: ILoginForm) {
    this.reduxService.dispatch(LoginInProgressAction());

    const { status, response, error } = await this.httpService.post(
      "/auth/login",
      {
        body: loginForm,
      }
    );

    if (![StatusCodes.OK, StatusCodes.CREATED].includes(status)) {
      return this.reduxService.dispatch(LoginFailureAction(error));
    }

    const { user, accessToken } = response;

    const token = Token.decode(accessToken);

    return this.reduxService.dispatch(
      LoginSuccessAction(User.fromJson(user), token)
    );
  }

  /**
   * Refresh authentication
   */
  public async refreshAuth() {
    this.reduxService.dispatch(RefreshAuthInProgress());
    const { status, response } = await this.httpService.post("/auth/refresh");
    if (
      status !== StatusCodes.OK ||
      (status === StatusCodes.OK && !response.user)
    ) {
      return this.reduxService.dispatch(RefreshAuthFailureAction());
    }
    const token = Token.decode(response.token);

    return this.reduxService.dispatch(
      RefreshAuthSuccessAction(User.fromJson(response.user), token)
    );
  }

  /**
   * Log out the user
   */
  public async logout() {
    await this.httpService.get("/auth/logout");
    return this.reduxService.dispatch(LogoutAction());
  }

  /**
   * Register a user
   * @param {IRegisterForm} registerForm
   */
  public async register(registerForm: IRegisterForm) {
    this.reduxService.dispatch(RegisterInProgressAction());

    const { status, response, error } = await this.httpService.post(
      "/auth/register",
      {
        body: registerForm,
      }
    );

    if (![StatusCodes.OK, StatusCodes.CREATED].includes(status))
      return this.reduxService.dispatch(RegisterFailureAction(error));

    const { user, accessToken } = response;
    const token = Token.decode(accessToken);

    return this.reduxService.dispatch(
      RegisterSuccessAction(User.fromJson(user), token)
    );
  }
}
