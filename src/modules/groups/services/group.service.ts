import { Injectable } from '@polyflix/di'
import { StatusCodes } from 'http-status-codes'

import { HttpService } from '../../common/services'
import { Group } from '../models/group.model'
import { IGroup, IGroupForm } from '../types/groups.type'

@Injectable()
export class GroupService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Create a group
   * @param {IGroupForm} group the form data to post
   * @returns {Promise<Group>}
   */
  public async createGroup(group: IGroupForm): Promise<Group> {
    const { status, response, error } = await this.httpService.post(`/groups`, {
      body: group,
    })
    if (status !== StatusCodes.CREATED) {
      throw error
    }
    return response
  }

  public async getGroupsJoined(): Promise<(json: IGroup) => Group[]> {
    const { status, response, error } = await this.httpService.get(
      `/groups/me`,
      {}
    )
    if (status !== StatusCodes.OK) {
      // eslint-disable-next-line
      throw { error, status }
    }
    return response.items.map(Group.fromJson)
  }

  public async getGroups(): Promise<(json: IGroup) => Group> {
    const { status, response, error } = await this.httpService.get(`/groups`, {
      //body:params,
    })
    if (status !== StatusCodes.OK) {
      // eslint-disable-next-line
      throw { error, status }
    }

    return response.items.map(Group.fromJson)
  }

  public async getGroupBySlug(slug: string): Promise<Group> {
    const { status, response, error } = await this.httpService.get(
      `/groups/${slug}`,
      {}
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return Group.fromJson(response)
  }

  /**
   * Update a group
   * @param {string} id the group id
   * @param {IGroupForm} data the group form
   * @param {Token} token the access token
   * @returns {Promise<Group>}
   */
  public async updateGroup(id: string, data: IGroupForm): Promise<Group> {
    const { status, response, error } = await this.httpService.patch(
      `/groups/${id}`,
      {
        body: data,
      }
    )
    if (status !== StatusCodes.OK && status !== StatusCodes.NO_CONTENT) {
      throw error
    }
    return Group.fromJson(response)
  }

  /**
   * Join a group
   * @param {string} id the group id
   * @param {string} id the user id
   * @returns {Promise<Group>}
   */
  public async joinGroup(id: string): Promise<Group> {
    const { status, response, error } = await this.httpService.post(
      `/groups/join/${id}`,
      {}
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return Group.fromJson(response)
  }

  public async leaveGroup(id: string): Promise<Group> {
    const { status, response, error } = await this.httpService.post(
      `/groups/leave/${id}`,
      {}
    )
    if (status !== StatusCodes.OK) {
      throw error
    }
    return Group.fromJson(response)
  }
}
