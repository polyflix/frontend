import { IUser } from "../../authentication/types/auth.type";

/**
 * The class User represent a User in the front-end.
 * @class User
 */
export class User {
  private constructor(
    private readonly _id: number | string,
    private readonly _email: string,
    private readonly _firstName: string,
    private readonly _lastName: string,
    private readonly _isAccountActivated: boolean,
    private readonly _isAdmin: boolean
  ) {}

  /**
   * Parse a JSON response into a User class instance.
   * @param {IUser} json
   * @returns {User} a user instance
   */
  static fromJson(json: IUser): User {
    return new User(
      json.id,
      json.email,
      json.firstName,
      json.lastName,
      json.isAccountActivated,
      json.isAdmin
    );
  }

  /**
   * Return the id of the user.
   * @returns {string} the id of the user
   */
  get id(): number | string {
    return this._id;
  }

  /**
   * Return the email of the user.
   * @returns {string} the email of the user
   */
  get email(): string {
    return this._email;
  }

  /**
   * Return true if the user has activated is account, false otherwise.
   * @returns {boolean} true if account is activated, false otherwise.
   */
  get isAccountActivated(): boolean {
    return this._isAccountActivated;
  }

  /**
   * Return true if the user is admin, false otherwise.
   * @returns {boolean} true if user is admin, false otherwise.
   */
  get isAdmin(): boolean {
    return this._isAdmin;
  }

  /**
   * Return the first name of the user
   * @returns {string} the user first name
   */
  get firstName(): string {
    return this._firstName;
  }

  /**
   * Return the last name of the user
   * @returns {string} the user last name
   */
  get lastName(): string {
    return this._lastName;
  }

  /**
   * Return the display name of the user.
   * @returns {string} the display name of the user.
   */
  get displayName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  /**
   * Return initials of the user
   * @returns {string} the user initials
   */
  get initials(): string {
    return `${this._firstName[0]}${this._lastName[0]}`;
  }
}
