import { Injectable } from '@polyflix/di'
import { StatusCodes } from 'http-status-codes'
import {
  AuthAction,
  LogoutAction,
  UpdateUserFailureAction,
  UpdateUserSuccessAction,
} from '../../authentication'
import { ReduxService } from '../../common/services'
import { HttpService } from '../../common/services/http.service'
import { User } from '../models/user.model'
import { IUserPasswordForm, IUserProfileUpdate } from '../types'

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly reduxService: ReduxService<AuthAction>
  ) {}

  /**
   * Gets a user by his id
   * @param {Token} token the access token
   * @param {string} id the id of the user requested
   * @returns {Promise<User>}
   */
  public async getUser(id: string): Promise<User> {
    const { status, response, error } = await this.httpService.get(
      `/users/${id}`
    )
    if (status !== StatusCodes.OK) {
      // eslint-disable-next-line
      throw { error, status }
    }
    return User.fromJson(response)
  }

  /**
   * Updates a user by his id
   * @param {Token} token the access token
   * @param {string} id the id of the user requested
   * @param {IUserProfileUpdate} data the user data
   * @returns {Promise<void>}
   */
  public async updateUser(
    id: string,
    data: IUserProfileUpdate | IUserPasswordForm
  ): Promise<void> {
    const { status: updateStatus, error: updateError } =
      await this.httpService.put(`/users/${id}`, {
        body: data,
      })
    const { status, response, error } = await this.httpService.get(`/users/me`)

    if (updateStatus !== StatusCodes.OK) {
      return this.reduxService.dispatch(UpdateUserFailureAction(updateError))
    }
    if (status !== StatusCodes.OK) {
      return this.reduxService.dispatch(UpdateUserFailureAction(error))
    }

    return this.reduxService.dispatch(
      UpdateUserSuccessAction(User.fromJson(response))
    )
  }

  /**
   * Deletes a user by his id
   * @param {Token} token the access token
   * @param {string} id the id of the user requested
   * @returns {Promise<void>}
   */
  public async deleteUser(id: string): Promise<void> {
    const { status, error } = await this.httpService.delete(`/users/${id}`)
    if (status !== StatusCodes.OK) {
      return this.reduxService.dispatch(UpdateUserFailureAction(error))
    }
    await this.httpService.get('/auth/logout')
    return this.reduxService.dispatch(LogoutAction())
  }
}
