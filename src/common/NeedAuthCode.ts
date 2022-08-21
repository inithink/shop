export class NeedAuthCode extends Error {
  constructor() {
    super('need auth code');
  }
}
