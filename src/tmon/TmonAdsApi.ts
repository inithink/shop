import {BaseApi} from "../common/BaseApi";
import {LoginError} from "../common/IdPasswordNotMatchedError";
import {toTwoDigit} from "../common/toTwoDigit";

const RSA = require('./rsa');
const publicKey = RSA.getPublicKey("-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl3NgVk\/RX56\/67zRbfRp\nFTKu2SB0rrjebPXYEYvrtimbVQpmSIOe12BKVXMKCkMVM8iELLCdaDKViOgJIUfo\nDyTOtulZ3hX+elB61vM5sZKImt2e24fHGIHZLtxfveNUcCPe5kz0ISppJtTgjhFc\nK0vzD3GjQPGwkflGJwao0Ikk6o+TfazlrB871gsR8p9DTE2lAARPorXfglkOT3WF\n9V\/gYxi301T22RE55ZILaM+Tg71VxeNuNRbzA8SLUpKaVObREAVGoyKSOiFObbz3\nic5uNHcYVnrUDdbU5h6\/zMb1zG\/6tPR2tRHIdByzQy5kCdItc6cvId0RBDvRz+MO\nFQIDAQAB\n-----END PUBLIC KEY-----");

export class TmonAdsApi extends BaseApi {
  async login(id: string, password: string) {
    let body = new URLSearchParams({
      return_url: '/',
      id_save: '',
      install_nos: '',
      ts: `${Math.floor(Date.now() / 1000)}`,
      isCaptchaOn: '',
      captchaType: 'image',
      captchaKey: '',
      captchaUrl: '',
      isCertifyOn: '',
      id: id,
      password: password,
      target: `partner`,
      form_password: password,
      secureLogin: '',
      captchaValue: '',
      certifyPass: '',
    });
    let res = await this.fetch("https://spc.tmon.co.kr/member/auth", {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body,
      "method": "POST"
    });

    let text = await res.text();
    try {
      let json = JSON.parse(text);
      if (json.success !== 'OK') {
        throw new LoginError();
      }
    } catch (e) {
      console.log(text);
      throw new LoginError();
    }

    await this.fetch('https://spc.tmon.co.kr/default/admonseller');
  }

  async getAdsEffectDailyReport(
    startYear: number, startMonth: number, startDate: number,
    endYear: number, endMonth: number, endDate: number,
  ) {
    let startDateString = `${startYear}-${toTwoDigit(startMonth)}-${toTwoDigit(startDate)}`;
    let endDateString = `${endYear}-${toTwoDigit(endMonth)}-${toTwoDigit(endDate)}`;
    let body = new URLSearchParams({
      startDate: startDateString,
      endDate: endDateString,
    });
    let res = await this.fetch("https://www.admonseller.com/adEffectRpt/adEffectRpt04/loadChart", {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body,
      "method": "POST"
    });
    let json = await res.text();
    return json;
  }
}

interface GetAdsEffectDailyReportItem {
  "basicDate": string, // "20220801"
  "impCnt": 43584, // 노출 수
  "clickCnt": 283, // 클릭 수
  "adspend": 56023, // 광고비 (VAT포함)
  "conversionNumber": 9, // 전환 수
  "conversionRate": 3.18, // 전환율
  "dealSalesPayment": 244600, // 구매 금액
  "roasRate": 436.61, // 광고 수익률
  "ctr": 0.65, // 클릭율
  "cpc": 179.96, // 평균 클릭비용 (VAT 미포함)
  "avgRank": 2.87, // 평균 노출 순위
  "isNew": false
}

interface GetAdsEffectDailyReportResponse {
  "success": true,
  "message": {
    "chart": GetAdsEffectDailyReportItem[]
  }
}
