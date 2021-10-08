import { User } from '../../users'

export class Member {
  private constructor(
    private readonly id: number,
    private readonly role: string,
    private readonly userId: string,
    private readonly groupId: string,
    readonly user: User
  ) {}

  static fromJson(json: Member): Member {
    return new Member(json.id, json.role, json.userId, json.groupId, json.user)
  }
}
