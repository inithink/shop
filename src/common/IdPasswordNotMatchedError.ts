export class LoginError extends Error {
  constructor() {
    super('login failed');
  }
}
