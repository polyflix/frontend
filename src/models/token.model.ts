/**
 * The class Token represent a JWT in the front-end.
 * @class Token
 */
export class Token {
  private constructor(
    private readonly encoded: string,
    private readonly exp: number,
    private readonly iat: number,
    private readonly sub: number
  ) {}

  /**
   * Decode a JWT access token and return an instance of Token.
   * @param {string} token the JWT access token
   * @returns {Token} an instance of Token
   */
  static decode(token: string): Token {
    const [, payload] = token.split(".");
    const { exp, iat, sub } = JSON.parse(atob(payload));
    return new Token(token, exp, iat, parseInt(sub, 10));
  }

  /**
   * Get the expiration in milliseconds for the Token.
   * @returns {number} the expiration in milliseconds
   */
  getExpirationInMillis(): number {
    return (this.exp - this.iat) * 1000;
  }

  /**
   * Return the subject of the JWT.
   * @returns {number} the subject
   */
  getSubject(): number {
    return this.sub;
  }

  /**
   * Return the JWT access token.
   * @returns {string} the JWT access token
   */
  getJWT(): string {
    return this.encoded;
  }

  /**
   * Return the Authorization header pre-filled.
   * @returns the authorization header
   */
  getAuthorizationHeader(): { Authorization: string } {
    return { Authorization: `Bearer ${this.getJWT()}` };
  }
}
