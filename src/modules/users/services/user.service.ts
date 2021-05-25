import { StatusCodes } from "http-status-codes";
import { Token } from "../../authentication/models/token.model";
import { HttpService } from "../../common/services/http.service";
import { Injectable } from "@polyflix/di";
import { User } from "../models/user.model";

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  /**
   *
   * @param {Token} token the access token
   * @param {number} id the id of the user requested
   * @returns {Promise<User>}
   */
  public async getUser(token: Token, id: string): Promise<User> {
    const { status, response, error } = await this.httpService.get(
      `/users/${id}`,
      {
        headers: token.getAuthorizationHeader(),
      }
    );
    if (status !== StatusCodes.OK) {
      // eslint-disable-next-line
      throw { error, status };
    }
    return User.fromJson(response);
  }
}
