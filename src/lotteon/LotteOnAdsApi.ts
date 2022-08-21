import {LoginError} from "../common/IdPasswordNotMatchedError";
import {NeedAuthCode} from "../common/NeedAuthCode";
import {toTwoDigit} from "../common/toTwoDigit";
import {LoginResponse} from "./types/LoginResponse";
import {GetSellerMoneyHistoryResponse} from "./types/SellerMoneyHistory";
import {BaseApi} from "../common/BaseApi";


export class LotteOnAdsApi extends BaseApi {
  private authToken: string = '';
  private userNo: string = '';
  private loginId: string = '';

  constructor(
    private gcmDeviceId: number
  ) {
    super();
  }

  private trNo: any;

  async login(id: string, password: string, authCode: string = '', authType: 'EML' | '' = 'EML') {
    let body = {
      "id": id,
      "passwd": password,
      "byfLinYn": "",
      "deviceType": "PC",
      "tempAthnKey": "",
      "athnCode": "",
      "secondAuthCode": authCode,  // 이메일 인증코드를 넣어주면 로그인 가능
      "pwdGuidePassStat": "",
      "secondAuthSendType": authType, // EML -> 이메일로 인증하겠다.
      "fgpCode": this.gcmDeviceId,
      "secAuthUseYn": 'N', // Y -> 이메일 인증 코드를 사용할 경우 Y
      "check_login": "btn-click-pc",
      "channelType": "store"
    };
    let res = await this.fetch("https://soapi.lotteon.com/soapi/v1/bocommon/o/auth/SO/cert/primary", {
      "headers": {
        "accept": "application/json",
        "accept-language": "ko-KR",
        "content-type": "application/json; charset=\"UTF-8\"",
      },
      "body": JSON.stringify(body),
      "method": "POST"
    });
    let json = await res.json() as LoginResponse;

    if (json.returnCode === 'PWD_NOT_INDT') {
      console.log(json);
      throw new LoginError();
    }
    if (json.returnCode === 'NO_SELECT_SECOND_AUTH_SENDTYPE') {
      console.log(json);
      throw new NeedAuthCode();
    }
    if (json.returnCode !== "NORMAL") {
      console.log(json);
      throw new Error(json.message as string);
    }
    this.authToken = json.data.authToken;
    this.userNo = json.data.userNo;
    this.loginId = json.data.loginId;

    let data = await this.fetch("https://soapi.lotteon.com/soapi/v1/bocommon/auth/loginUserInfo", {
      "headers": {
        "accept": "*/*",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": `Bearer ${this.authToken}`,
      },
      "method": "GET"
    });
    let jsonLoginUserInfo = await data.json();
    this.trNo = jsonLoginUserInfo.data.trNo;
  }


  async requestEmailAuth(id: string, password: string) {
    let body = {
      "id": id,
      "passwd": password,
      "byfLinYn": "",
      "deviceType": "PC",
      "tempAthnKey": "",
      "athnCode": "",
      "secondAuthCode": "",
      "pwdGuidePassStat": "",
      "secondAuthSendType": "EML",
      "fgpCode": this.gcmDeviceId,
      "secAuthUseYn": "N",
      "check_login": "btn-click-pc",
      "channelType": "store"
    };
    let res = await this.fetch("https://soapi.lotteon.com/soapi/v1/bocommon/o/auth/SO/cert/primary", {
      "headers": {
        "accept": "application/json",
        "accept-language": "ko-KR",
        "content-type": "application/json; charset=\"UTF-8\"",
      },
      "body": JSON.stringify(body),
      "method": "POST"
    });
    let json = await res.json() as LoginResponse;

    if (json.returnCode === 'PWD_NOT_INDT') {
      throw new LoginError();
    }
    if (json.returnCode !== "NEED_SECOND_AUTH_SOEMAIL") {
      throw new Error('unexpected');
    }
  }


  async sendEmailAuthCode(id: string, password: string, authCode: string) {
    let body = {
      "id": id,
      "passwd": password,
      "byfLinYn": "",
      "deviceType": "PC",
      "tempAthnKey": "",
      "athnCode": "",
      "secondAuthCode": authCode,
      "pwdGuidePassStat": "",
      "secondAuthSendType": "EML",
      "fgpCode": this.gcmDeviceId,
      "secAuthUseYn": "Y",
      "check_login": "btn-click-pc",
      "channelType": "store"
    };
    let res = await this.fetch("https://soapi.lotteon.com/soapi/v1/bocommon/o/auth/SO/cert/primary", {
      "headers": {
        "accept": "application/json",
        "accept-language": "ko-KR",
        "content-type": "application/json; charset=\"UTF-8\"",
      },
      "body": JSON.stringify(body),
      "method": "POST"
    });
    let json = await res.json() as LoginResponse;

    if (json.returnCode === 'PWD_NOT_INDT') {
      throw new LoginError();
    }
    if (json.returnCode !== "NORMAL") {
      throw new LoginError();
    }
  }

  async getSellerMoneyHistory(
    startYear: number, startMonth: number, startDate: number,
    endYear: number, endMonth: number, endDate: number,
    page = 1, size = 500,
  ): Promise<GetSellerMoneyHistoryResponse> {
    let query = new URLSearchParams({
      trNo: this.trNo,
      srchReqStrtDt: `${startYear}${toTwoDigit(startMonth)}${toTwoDigit(startDate)}`,
      srchReqEndDt: `${endYear}${toTwoDigit(endMonth)}${toTwoDigit(endDate)}`,
      accmUseType: '',
      accmUseDvsCd: '',
      smnyTypNo: '',
      onlyCancel: '',
      smnyFilMnsCd: '',
      pageNo: `${page}`,
      rowsPerPage: `${size}`,
    });

    const res = await this.fetch(`https://soapi.lotteon.com/soapi/v1/selleroffice/sellermoneyaccumuse/getAccmUseModelList?${query.toString()}`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "ko-KR",
        "authorization": `Bearer ${this.authToken}`,
        "content-type": "application/json; charset=\"UTF-8\"",
      },
      "method": "GET"
    });
    let json = await res.json();
    return json as GetSellerMoneyHistoryResponse;
  }
}

