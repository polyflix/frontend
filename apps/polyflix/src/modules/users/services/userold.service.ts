import { EntityId } from '@reduxjs/toolkit'
import { StatusCodes } from 'http-status-codes'

import { Injectable } from '@polyflix/di'

import { CrudAbstractService } from '@services/crud-abstract.service'
import {
  ApiVersion,
  CrudAction,
  IApiResponse,
  WithPagination,
} from '@types_/http.type'

import { logoutUser, setUser } from '@auth/reducers/auth.slice'

import { User } from '@users/models/user.model'
import { IUserPasswordForm } from '@users/types/users.type'

@Injectable()
export class UseroldService extends CrudAbstractService<
  User,
  IUserPasswordForm & User
> {
  constructor() {
    super(ApiVersion.V1, 'users')
  }

  async delete(item: User): Promise<void> {
    const { status, error } = await this.httpService.delete(
      `${this.endpoint}/${item.id}`
    )

    if (status !== StatusCodes.NO_CONTENT) {
      // Example for snackbar
      this.snackbarService.createSnackbar(error, {
        variant: 'error',
      })
    }

    this.notify(CrudAction.DELETE)

    this.dispatch(logoutUser())
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findAll(): Promise<IApiResponse<WithPagination<User[]>>> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(item: User): Promise<User> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getById(id: EntityId): Promise<User> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  save(data: {}): Promise<User> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(data: {}): Promise<void | User> {
    throw new Error('Method not implemented.')
  }

  async updateUser(item: User | (IUserPasswordForm & User)) {
    const {
      response: user,
      status,
      error,
    } = await this.httpService.put(`${this.endpoint}/${item.id}`, {
      body: item,
    })

    if (status !== StatusCodes.OK) {
      return this.snackbarService.createSnackbar(error, {
        variant: 'error',
      })
    }

    this.notify(CrudAction.UPDATE)

    return this.dispatch(setUser(user))
  }
}
