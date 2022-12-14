import {BaseApi} from "../common/BaseApi";
import {LoginError} from "../common/IdPasswordNotMatchedError";
import {toTwoDigit} from "../common/toTwoDigit";

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
    return await res.json();
  }
}

interface GetAdsEffectDailyReportItem {
  "basicDate": string, // "20220801"
  "impCnt": 43584, // ?????? ???
  "clickCnt": 283, // ?????? ???
  "adspend": 56023, // ????????? (VAT??????)
  "conversionNumber": 9, // ?????? ???
  "conversionRate": 3.18, // ?????????
  "dealSalesPayment": 244600, // ?????? ??????
  "roasRate": 436.61, // ?????? ?????????
  "ctr": 0.65, // ?????????
  "cpc": 179.96, // ?????? ???????????? (VAT ?????????)
  "avgRank": 2.87, // ?????? ?????? ??????
  "isNew": false
}

interface GetAdsEffectDailyReportResponse {
  "success": true,
  "message": {
    "chart": GetAdsEffectDailyReportItem[]
  }
}
