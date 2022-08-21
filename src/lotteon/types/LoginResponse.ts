// TFA_SO_P, aIq5RNJZZxqry%2BEAJeN9MtaGPfgvhQ25ePHleaQPmbc%3D
export interface LoginResponse {
  "returnCode": "NORMAL" | "PWD_NOT_INDT" | "NO_SELECT_SECOND_AUTH_SENDTYPE" | "NEED_SECOND_AUTH_SOEMAIL" | "SECOND_AUTH_TIMEOUT",
  "message": null | string,
  "subMessages": null,
  "dataCount": null,
  "data": {
    "loginId": string,
    "authToken": string,
    "userNo": string,
  }
}
